/**
 * Test script for CliftonStrengths PDF Parser
 * This script tests the parser with the provided PDF files
 */

import { CliftonStrengthsPDFParser } from './services/cliftonStrengthsPDFParser';
import path from 'path';

async function testParser() {
  const parser = new CliftonStrengthsPDFParser();
  
  // Test files
  const testFiles = [
    '/Users/amynporb/Documents/projects/personal-coach/resources/Porbanderwala-Amyn-SF_TOP_5.pdf',
    '/Users/amynporb/Documents/projects/personal-coach/resources/Porbanderwala-Amyn-ALL_34.pdf'
  ];

  console.log('🚀 Testing CliftonStrengths PDF Parser\n');

  for (const filePath of testFiles) {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);
    console.log('='.repeat(50));

    try {
      const result = await parser.parsePDFFromPath(filePath);
      
      if (!result.success) {
        console.error('❌ Failed to parse PDF:', result.error);
        continue;
      }

      const profile = result.data!;
      
      console.log(`✅ Successfully parsed PDF for: ${profile.name}`);
      console.log(`📅 Assessment Date: ${profile.assessmentDate.toDateString()}`);
      console.log(`📊 Format: ${profile.format.toUpperCase()}`);
      console.log(`🎯 Leading Domain: ${profile.leadingDomain}`);
      console.log(`📈 Total Strengths Found: ${profile.strengths.length}`);

      console.log('\n🏆 Top 5 Strengths:');
      profile.topFive.forEach((strength, index) => {
        console.log(`  ${index + 1}. ${strength.name} (${strength.domain})`);
      });

      if (profile.topTen) {
        console.log('\n🎖️ Top 10 Strengths:');
        profile.topTen.forEach((strength, index) => {
          console.log(`  ${index + 1}. ${strength.name} (${strength.domain})`);
        });
      }

      console.log('\n📊 Domain Summary:');
      profile.domainSummary.forEach(domain => {
        console.log(`  ${domain.domain}: ${domain.count} strengths`);
        domain.strengths.slice(0, 3).forEach(strength => {
          console.log(`    - ${strength.name} (#${strength.rank})`);
        });
        if (domain.strengths.length > 3) {
          console.log(`    ... and ${domain.strengths.length - 3} more`);
        }
      });

      if (profile.format === 'full34') {
        console.log('\n🔢 All 34 Strengths Rankings:');
        profile.strengths.forEach(strength => {
          console.log(`  ${strength.rank}. ${strength.name} (${strength.domain})`);
        });
      }

    } catch (error) {
      console.error('💥 Error processing file:', error);
    }
  }
}

// Run the test
if (require.main === module) {
  testParser()
    .then(() => console.log('\n✨ Test completed!'))
    .catch(error => console.error('\n💥 Test failed:', error));
}

export { testParser };