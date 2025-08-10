/**
 * CliftonStrengths PDF Parser
 * Parses CliftonStrengths PDF reports and extracts user profile data
 */

import { 
  UserProfile, 
  Strength, 
  StrengthDomain, 
  StrengthFormat, 
  DomainSummary,
  ParsedPDFResult,
  STRENGTH_DOMAIN_MAP,
  ALL_STRENGTHS_INFO
} from '../types/clifton-strengths';
import { AIPDFParser } from './ai-pdf-parser';

export class CliftonStrengthsPDFParser {

  /**
   * Parse PDF from uploaded file buffer
   */
  async parsePDFFromBuffer(buffer: Buffer): Promise<ParsedPDFResult> {
    try {
      // Import PDF parser dynamically for edge runtime compatibility
      const pdfParse = (await import('pdf-parse')).default;
      
      const data = await pdfParse(buffer);
      const text = data.text;
      
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'PDF appears to be empty or contains no readable text'
        };
      }

      return await this.parseTextContent(text);
    } catch (error) {
      console.error('Error parsing PDF buffer:', error);
      return {
        success: false,
        error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse extracted text content from PDF
   */
  private async parseTextContent(text: string): Promise<ParsedPDFResult> {
    try {
      // First, try AI-powered extraction
      const aiParser = new AIPDFParser();
      const aiResult = await aiParser.extractDataWithAI(text);
      
      if (aiResult.success && aiResult.data) {
        console.log('Using AI-powered extraction for PDF parsing');
        return this.processAIExtractionResult(aiResult.data, text);
      } else {
        console.log('AI extraction failed, falling back to regex parsing:', aiResult.error);
        return this.fallbackToRegexParsing(text);
      }
    } catch (error) {
      console.error('Error in parseTextContent:', error);
      return this.fallbackToRegexParsing(text);
    }
  }

  /**
   * Process AI extraction result into UserProfile format
   */
  private processAIExtractionResult(aiData: any, fullText: string): ParsedPDFResult {
    try {
      // Map AI strengths to our Strength format with domains
      const strengths: Strength[] = aiData.strengths.map((s: any) => ({
        name: s.name,
        rank: s.rank,
        domain: STRENGTH_DOMAIN_MAP[s.name] || StrengthDomain.EXECUTING, // Default domain
        description: s.description || ALL_STRENGTHS_INFO[s.name] || '',
        hasTrademarkSymbol: false
      }));

      // Determine format based on number of strengths
      let format: StrengthFormat;
      if (strengths.length >= 30) {
        format = StrengthFormat.FULL_34;
      } else if (strengths.length >= 8) {
        format = StrengthFormat.TOP_10;
      } else {
        format = StrengthFormat.TOP_5;
      }

      // Create domain summary
      const domainSummary = this.createDomainSummary(strengths);
      
      // Find leading domain
      const leadingDomain = this.findLeadingDomain(strengths.slice(0, 5));

      // Parse assessment date
      const assessmentDate = new Date(aiData.assessmentDate);

      // Create user profile
      const profile: UserProfile = {
        name: aiData.userName,
        assessmentDate,
        format,
        strengths: strengths.sort((a, b) => a.rank - b.rank),
        topFive: strengths.filter(s => s.rank <= 5).sort((a, b) => a.rank - b.rank),
        topTen: strengths.length >= 10 ? strengths.filter(s => s.rank <= 10).sort((a, b) => a.rank - b.rank) : undefined,
        domainSummary,
        leadingDomain
      };

      return {
        success: true,
        data: profile,
        warnings: [`Successfully extracted data for ${aiData.userName} using AI parsing`],
        fullTextContent: fullText,
        additionalUserInfo: aiData.additionalInfo // Store additional info for session
      };
    } catch (error) {
      console.error('Error processing AI extraction result:', error);
      return {
        success: false,
        error: `Failed to process AI extraction: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Fallback to regex-based parsing if AI fails
   */
  private fallbackToRegexParsing(text: string): ParsedPDFResult {
    try {
      // Extract user name (with fallback)
      const name = this.extractUserName(text)!; // Now always returns a name

      // Extract assessment date
      const assessmentDate = this.extractAssessmentDate(text);
      if (!assessmentDate) {
        return {
          success: false,
          error: 'Could not find assessment date in PDF'
        };
      }

      // Extract strengths
      const strengths = this.extractStrengths(text);
      if (strengths.length === 0) {
        return {
          success: false,
          error: 'Could not parse any CliftonStrengths from the PDF. Please ensure this is a valid CliftonStrengths report with numbered strength rankings.'
        };
      }

      // Determine format based on number of strengths
      let format: StrengthFormat;
      if (strengths.length >= 30) {
        format = StrengthFormat.FULL_34;
      } else if (strengths.length >= 8) {
        format = StrengthFormat.TOP_10;
      } else {
        format = StrengthFormat.TOP_5;
      }

      // Create domain summary
      const domainSummary = this.createDomainSummary(strengths);
      
      // Find leading domain
      const leadingDomain = this.findLeadingDomain(strengths.slice(0, 5));

      // Create user profile
      const profile: UserProfile = {
        name,
        assessmentDate,
        format,
        strengths: strengths.sort((a, b) => a.rank - b.rank),
        topFive: strengths.filter(s => s.rank <= 5).sort((a, b) => a.rank - b.rank),
        topTen: strengths.length >= 10 ? strengths.filter(s => s.rank <= 10).sort((a, b) => a.rank - b.rank) : undefined,
        domainSummary,
        leadingDomain
      };

      return {
        success: true,
        data: profile,
        warnings: this.generateWarnings(text, strengths),
        fullTextContent: text // Include full text for comprehensive AI analysis
      };

    } catch (error) {
      console.error('Error parsing text content:', error);
      return {
        success: false,
        error: `Failed to parse PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract user name from PDF text
   */
  private extractUserName(text: string): string | null {
    // Look for common name patterns in CliftonStrengths reports
    const namePatterns = [
      /CliftonStrengths\s+for\s+(.+?)(?:\n|Date|Completion|$)/i,
      /Report\s+for\s+(.+?)(?:\n|Date|Completion|$)/i,
      /(?:Name|For):\s*(.+?)(?:\n|Date|$)/i,
      /^(.+?)\s*CliftonStrengths/im,
      /Personalized\s+Report\s+for\s+(.+?)(?:\n|$)/i,
      /Report\s+Prepared\s+for\s+(.+?)(?:\n|$)/i,
      /(.+?)\s+CliftonStrengths\s+Report/i,
      // More flexible patterns for various report formats
      /Your\s+CliftonStrengths\s+(.+?)(?:\n|$)/i,
      /Strengths\s+Profile\s+for\s+(.+?)(?:\n|$)/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        // Filter out common false positives
        if (name.length > 2 && 
            !name.includes('Report') && 
            !name.includes('Assessment') &&
            !name.includes('Completion') &&
            !name.includes('Date') &&
            !name.match(/^\d+/)) { // Not starting with numbers
          return name;
        }
      }
    }

    // If no name found, use a generic fallback instead of failing
    console.warn('Could not extract user name from PDF, using generic name');
    return 'CliftonStrengths User';
  }

  /**
   * Extract assessment date from PDF text
   */
  private extractAssessmentDate(text: string): Date | null {
    const datePatterns = [
      /Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/,
      /Date:\s*(\d{1,2}-\d{1,2}-\d{4})/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{4}-\d{1,2}-\d{1,2})/,
      /Assessment\s+Date:\s*(.+?)(?:\n|$)/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1].trim();
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    // Fallback to current date if none found
    return new Date();
  }

  /**
   * Extract strengths from PDF text
   */
  private extractStrengths(text: string): Strength[] {
    const strengths: Strength[] = [];
    const lines = text.split('\n');

    // Look for numbered strength lists
    const strengthPattern = /^\s*(\d+)\.?\s*([A-Za-z\s®™-]+)/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(strengthPattern);
      
      if (match) {
        const rank = parseInt(match[1]);
        let strengthName = match[2].trim();
        
        // Clean up strength name
        strengthName = strengthName.replace(/[®™]/g, '').trim();
        
        // Map to domain
        const domain = STRENGTH_DOMAIN_MAP[strengthName];
        if (domain) {
          strengths.push({
            name: strengthName,
            rank,
            domain,
            description: ALL_STRENGTHS_INFO[strengthName] || '',
            hasTrademarkSymbol: match[2].includes('®') || match[2].includes('™')
          });
        }
      }
    }

    // No fallback demo data - if we can't parse strengths, we should fail
    if (strengths.length === 0) {
      console.error('Failed to parse any strengths from PDF content');
      return [];
    }

    // Remove duplicates by name and ensure proper ranking
    const uniqueStrengths = strengths.reduce((acc: Strength[], current) => {
      const existing = acc.find(s => s.name === current.name);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Re-rank to ensure no gaps and proper ordering
    const sortedStrengths = uniqueStrengths.sort((a, b) => a.rank - b.rank);
    sortedStrengths.forEach((strength, index) => {
      strength.rank = index + 1;
    });

    console.log(`Parsed ${sortedStrengths.length} unique strengths:`, 
      sortedStrengths.slice(0, 5).map(s => `${s.rank}. ${s.name}`)
    );

    return sortedStrengths;
  }

  /**
   * Create domain summary from strengths
   */
  private createDomainSummary(strengths: Strength[]): DomainSummary[] {
    const domainMap = new Map<StrengthDomain, Strength[]>();

    for (const strength of strengths) {
      if (!domainMap.has(strength.domain)) {
        domainMap.set(strength.domain, []);
      }
      domainMap.get(strength.domain)!.push(strength);
    }

    const summary: DomainSummary[] = [];
    for (const [domain, domainStrengths] of domainMap.entries()) {
      summary.push({
        domain,
        count: domainStrengths.length,
        strengths: domainStrengths.sort((a, b) => a.rank - b.rank)
      });
    }

    return summary.sort((a, b) => b.count - a.count);
  }

  /**
   * Find the leading domain based on top 5 strengths
   */
  private findLeadingDomain(topFive: Strength[]): StrengthDomain {
    const domainCounts = new Map<StrengthDomain, number>();

    for (const strength of topFive) {
      const current = domainCounts.get(strength.domain) || 0;
      domainCounts.set(strength.domain, current + 1);
    }

    let leadingDomain = StrengthDomain.EXECUTING;
    let maxCount = 0;

    for (const [domain, count] of domainCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        leadingDomain = domain;
      }
    }

    return leadingDomain;
  }

  /**
   * Generate parsing warnings
   */
  private generateWarnings(text: string, strengths: Strength[]): string[] {
    const warnings: string[] = [];

    if (strengths.length < 5) {
      warnings.push('Found fewer than 5 strengths - this may not be a complete CliftonStrengths report');
    }

    if (!text.includes('CliftonStrengths') && !text.includes('StrengthsFinder')) {
      warnings.push('Document may not be an official CliftonStrengths report');
    }

    const missingDescriptions = strengths.filter(s => !s.description || s.description.length === 0);
    if (missingDescriptions.length > 0) {
      warnings.push(`${missingDescriptions.length} strengths are missing descriptions`);
    }

    return warnings;
  }
}

// Factory function
export function createCliftonStrengthsParser(): CliftonStrengthsPDFParser {
  return new CliftonStrengthsPDFParser();
}