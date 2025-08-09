/**
 * Example Usage of CliftonStrengths PDF Parser
 * This demonstrates how to use the service in your application
 */

import { CliftonStrengthsPDFParser, StrengthFormat, StrengthDomain } from './services';

async function exampleUsage() {
  // Create parser instance
  const parser = new CliftonStrengthsPDFParser();

  try {
    // Example 1: Parse from file path
    console.log('📄 Parsing PDF from file path...');
    const result = await parser.parsePDFFromPath('/path/to/cliftonstrengths.pdf');
    
    if (!result.success) {
      console.error('❌ Failed to parse:', result.error);
      return;
    }

    const profile = result.data!;
    console.log(`✅ Parsed profile for: ${profile.name}`);

    // Example 2: Parse from buffer (useful for uploaded files)
    console.log('\n📤 Parsing PDF from buffer...');
    const fs = await import('fs/promises');
    const buffer = await fs.readFile('/path/to/cliftonstrengths.pdf');
    const bufferResult = await parser.parsePDF(buffer);

    if (bufferResult.success) {
      const bufferProfile = bufferResult.data!;
      
      // Access different aspects of the data
      console.log('\n🎯 User Information:');
      console.log(`Name: ${bufferProfile.name}`);
      console.log(`Assessment Date: ${bufferProfile.assessmentDate.toDateString()}`);
      console.log(`Format: ${bufferProfile.format}`);
      console.log(`Leading Domain: ${bufferProfile.leadingDomain}`);

      console.log('\n🏆 Top 5 Strengths:');
      bufferProfile.topFive.forEach((strength, index) => {
        console.log(`${index + 1}. ${strength.name} (${strength.domain})`);
        if (strength.description) {
          console.log(`   ${strength.description.substring(0, 100)}...`);
        }
      });

      // Check if full assessment
      if (bufferProfile.format === StrengthFormat.FULL_34) {
        console.log('\n🎖️ Top 10 Strengths:');
        bufferProfile.topTen!.forEach((strength, index) => {
          console.log(`${index + 1}. ${strength.name}`);
        });
      }

      // Domain analysis
      console.log('\n📊 Domain Analysis:');
      bufferProfile.domainSummary.forEach(domain => {
        console.log(`${domain.domain}: ${domain.count} strengths`);
        
        // Get top 3 strengths in this domain
        const topInDomain = domain.strengths.slice(0, 3);
        topInDomain.forEach(strength => {
          console.log(`  • ${strength.name} (#${strength.rank})`);
        });
      });

      // Filter strengths by domain
      const executingStrengths = bufferProfile.strengths.filter(
        s => s.domain === StrengthDomain.EXECUTING
      );
      console.log(`\n⚙️ Executing Strengths: ${executingStrengths.length}`);
      
      // Get bottom 5 (if full assessment)
      if (bufferProfile.strengths.length >= 10) {
        const bottomFive = bufferProfile.strengths.slice(-5);
        console.log('\n🔹 Bottom 5 Strengths (potential blind spots):');
        bottomFive.forEach(strength => {
          console.log(`${strength.rank}. ${strength.name} (${strength.domain})`);
        });
      }
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Example of integrating with Express.js
export function createExpressRoute() {
  return `
// Express.js route example
import express from 'express';
import multer from 'multer';
import { CliftonStrengthsPDFParser } from './services/cliftonStrengthsPDFParser';

const app = express();
const upload = multer();
const parser = new CliftonStrengthsPDFParser();

app.post('/upload-cliftonstrengths', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const result = await parser.parsePDF(req.file.buffer);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Save to database or return to client
    res.json({
      success: true,
      profile: result.data
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Server error processing PDF',
      details: error.message 
    });
  }
});
  `;
}

// Example of data transformation for different use cases
export function exampleDataTransformations(profile: any) {
  return {
    // For coaching dashboard
    dashboardSummary: {
      name: profile.name,
      assessmentDate: profile.assessmentDate,
      topStrengths: profile.topFive.map((s: any) => s.name),
      leadingDomain: profile.leadingDomain,
      strengthCount: profile.strengths.length
    },

    // For team analysis
    teamMemberProfile: {
      memberId: 'generate-unique-id',
      name: profile.name,
      strengths: profile.strengths.map((s: any) => ({
        name: s.name,
        rank: s.rank,
        domain: s.domain
      })),
      domainDistribution: profile.domainSummary.reduce((acc: any, domain: any) => {
        acc[domain.domain] = domain.count;
        return acc;
      }, {})
    },

    // For development planning
    developmentPlan: {
      strengthen: profile.topTen || profile.topFive, // Focus areas
      manage: profile.strengths.slice(10, 24), // Support areas
      navigate: profile.strengths.slice(24), // Potential blind spots
      domainBalance: profile.domainSummary.map((d: any) => ({
        domain: d.domain,
        strength: d.count >= 3 ? 'High' : d.count >= 1 ? 'Moderate' : 'Low'
      }))
    }
  };
}

// Run example if called directly
if (require.main === module) {
  exampleUsage()
    .then(() => console.log('\\n✨ Example completed!'))
    .catch(error => console.error('\\n💥 Example failed:', error));
}