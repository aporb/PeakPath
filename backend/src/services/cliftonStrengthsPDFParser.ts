/**
 * CliftonStrengths PDF Parser Service
 * Extracts and processes CliftonStrengths assessment data from PDF files
 */

import pdfParse from 'pdf-parse';
import {
  Strength,
  StrengthDomain,
  StrengthFormat,
  UserProfile,
  DomainSummary,
  ParsedPDFResult,
  PDFProcessingError,
  STRENGTH_DOMAIN_MAP,
  ALL_STRENGTHS_INFO
} from '../types/clifton-strengths';

export class CliftonStrengthsPDFParser {
  private static readonly STRENGTH_NAMES = Object.keys(STRENGTH_DOMAIN_MAP);
  
  /**
   * Parse a CliftonStrengths PDF buffer and extract strength data
   */
  async parsePDF(buffer: Buffer): Promise<ParsedPDFResult> {
    try {
      // Parse PDF to extract text
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text;

      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'PDF appears to be empty or unreadable'
        };
      }

      // Validate this is a CliftonStrengths PDF
      if (!this.isCliftonStrengthsPDF(text)) {
        return {
          success: false,
          error: 'PDF does not appear to be a valid CliftonStrengths assessment report'
        };
      }

      // Extract user profile data
      const userProfile = await this.extractUserProfile(text);
      
      return {
        success: true,
        data: userProfile
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse a PDF file from file path
   */
  async parsePDFFromPath(filePath: string): Promise<ParsedPDFResult> {
    try {
      const fs = await import('fs/promises');
      const buffer = await fs.readFile(filePath);
      return this.parsePDF(buffer);
    } catch (error) {
      return {
        success: false,
        error: `Failed to read PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if the PDF text contains CliftonStrengths indicators
   */
  private isCliftonStrengthsPDF(text: string): boolean {
    const indicators = [
      'CliftonStrengths',
      'StrengthsFinder',
      'Gallup',
      'Top 5',
      'EXECUTING',
      'INFLUENCING',
      'RELATIONSHIP BUILDING',
      'STRATEGIC THINKING'
    ];

    return indicators.some(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Extract user profile data from PDF text
   */
  private async extractUserProfile(text: string): Promise<UserProfile> {
    // Extract user name
    const name = this.extractUserName(text);
    
    // Extract assessment date
    const assessmentDate = this.extractAssessmentDate(text);
    
    // Extract strengths and determine format
    const { strengths, format } = this.extractStrengths(text);
    
    if (strengths.length === 0) {
      throw new Error('No CliftonStrengths found in PDF');
    }

    // Generate domain summary
    const domainSummary = this.generateDomainSummary(strengths);
    
    // Determine leading domain
    const leadingDomain = this.determineLeadingDomain(strengths.slice(0, 10));

    return {
      name,
      assessmentDate,
      format,
      strengths,
      topFive: strengths.slice(0, 5),
      topTen: strengths.length >= 10 ? strengths.slice(0, 10) : undefined,
      domainSummary,
      leadingDomain
    };
  }

  /**
   * Extract user name from PDF text
   */
  private extractUserName(text: string): string {
    // First, try to find the exact pattern "AMYN PORBANDERWALA | 08-08-2025"
    const exactPattern = /([A-Z]+\s+[A-Z]+)\s*\|\s*\d{2}-\d{2}-\d{4}/;
    const exactMatch = text.match(exactPattern);
    if (exactMatch && exactMatch[1]) {
      const name = exactMatch[1].trim();
      // Convert to proper case
      return this.toProperCase(name);
    }

    // Try the "Amyn Porbanderwala" pattern from Top 5 reports
    const topFivePattern = /Top 5 for\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/;
    const topFiveMatch = text.match(topFivePattern);
    if (topFiveMatch && topFiveMatch[1]) {
      return topFiveMatch[1].trim();
    }

    // Fallback patterns
    const namePatterns = [
      // General pattern for name with date
      /([A-Z][a-z]+\s+[A-Z][a-z]+)\s*\|\s*\d{2}-\d{2}-\d{4}/,
      // Pattern in lines
      /^([A-Z][a-z]+\s+[A-Z][a-z]+)$/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        // Validate that this looks like a person's name
        if (name.split(' ').length >= 2 && name.length <= 50 && /^[A-Za-z\s-']+$/.test(name)) {
          return name;
        }
      }
    }

    return 'Unknown User';
  }

  /**
   * Convert ALL CAPS name to Proper Case
   */
  private toProperCase(name: string): string {
    return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Extract assessment date from PDF text
   */
  private extractAssessmentDate(text: string): Date {
    // Look for date patterns like "08-08-2025" or "2025-08-08"
    const datePatterns = [
      /(\d{2}-\d{2}-\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1];
        let date: Date;
        
        if (dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts[0].length === 4) {
            // YYYY-MM-DD format
            date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          } else {
            // MM-DD-YYYY format
            date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          }
        } else {
          // MM/DD/YYYY format
          date = new Date(dateStr);
        }
        
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    return new Date(); // Default to current date if not found
  }

  /**
   * Extract strengths and rankings from PDF text
   */
  private extractStrengths(text: string): { strengths: Strength[], format: StrengthFormat } {
    const strengths: Strength[] = [];
    const foundStrengths = new Set<string>();

    // Method 1: Look for numbered lists (1. Strength, 2. Strength, etc.)
    const numberedPattern = /(\d+)\.\s*([A-Za-z-]+)(?:\s*[®™])?/g;
    let match;
    
    while ((match = numberedPattern.exec(text)) !== null) {
      const rank = parseInt(match[1]);
      let strengthName = match[2].trim();
      
      // Clean up strength name
      strengthName = this.normalizeStrengthName(strengthName);
      
      if (this.isValidStrengthName(strengthName) && !foundStrengths.has(strengthName)) {
        const domain = STRENGTH_DOMAIN_MAP[strengthName];
        const description = ALL_STRENGTHS_INFO[strengthName];
        
        strengths.push({
          name: strengthName,
          rank,
          domain,
          description,
          hasTrademarkSymbol: match[0].includes('®') || match[0].includes('™')
        });
        
        foundStrengths.add(strengthName);
      }
    }

    // Method 2: Look for strength names in lists without numbers
    if (strengths.length === 0) {
      const strengthsList = this.extractStrengthsFromLists(text);
      strengthsList.forEach((strengthName, index) => {
        if (!foundStrengths.has(strengthName)) {
          const domain = STRENGTH_DOMAIN_MAP[strengthName];
          const description = ALL_STRENGTHS_INFO[strengthName];
          
          strengths.push({
            name: strengthName,
            rank: index + 1,
            domain,
            description
          });
          
          foundStrengths.add(strengthName);
        }
      });
    }

    // Sort by rank
    strengths.sort((a, b) => a.rank - b.rank);

    // Determine format based on number of strengths found
    let format: StrengthFormat;
    if (strengths.length >= 30) {
      format = StrengthFormat.FULL_34;
    } else if (strengths.length >= 10) {
      format = StrengthFormat.TOP_10;
    } else {
      format = StrengthFormat.TOP_5;
    }

    return { strengths, format };
  }

  /**
   * Extract strengths from unordered lists in the text
   */
  private extractStrengthsFromLists(text: string): string[] {
    const strengths: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and lines that look like headers or descriptions
      if (trimmedLine.length === 0 || trimmedLine.length > 50) {
        continue;
      }
      
      // Look for strength names in the line
      for (const strengthName of CliftonStrengthsPDFParser.STRENGTH_NAMES) {
        if (trimmedLine.toLowerCase().includes(strengthName.toLowerCase())) {
          const normalizedName = this.normalizeStrengthName(strengthName);
          if (!strengths.includes(normalizedName)) {
            strengths.push(normalizedName);
          }
          break;
        }
      }
    }
    
    return strengths;
  }

  /**
   * Normalize strength name (handle variations and clean up)
   */
  private normalizeStrengthName(name: string): string {
    // Remove trademark symbols and extra whitespace
    let normalized = name.replace(/[®™]/g, '').trim();
    
    // Handle common variations
    const variations: Record<string, string> = {
      'Self-Assurance': 'Self-Assurance',
      'SelfAssurance': 'Self-Assurance',
      'Self Assurance': 'Self-Assurance'
    };
    
    return variations[normalized] || normalized;
  }

  /**
   * Check if a string is a valid CliftonStrengths name
   */
  private isValidStrengthName(name: string): boolean {
    return CliftonStrengthsPDFParser.STRENGTH_NAMES.includes(name);
  }

  /**
   * Generate domain summary from strengths
   */
  private generateDomainSummary(strengths: Strength[]): DomainSummary[] {
    const domainMap = new Map<StrengthDomain, Strength[]>();
    
    // Group strengths by domain
    strengths.forEach(strength => {
      if (!domainMap.has(strength.domain)) {
        domainMap.set(strength.domain, []);
      }
      domainMap.get(strength.domain)!.push(strength);
    });
    
    // Create summary array
    const summary: DomainSummary[] = [];
    domainMap.forEach((domainStrengths, domain) => {
      summary.push({
        domain,
        count: domainStrengths.length,
        strengths: domainStrengths.sort((a, b) => a.rank - b.rank)
      });
    });
    
    // Sort by count descending
    return summary.sort((a, b) => b.count - a.count);
  }

  /**
   * Determine leading domain based on top strengths
   */
  private determineLeadingDomain(topStrengths: Strength[]): StrengthDomain {
    const domainCounts = new Map<StrengthDomain, number>();
    
    topStrengths.forEach(strength => {
      const current = domainCounts.get(strength.domain) || 0;
      domainCounts.set(strength.domain, current + 1);
    });
    
    let leadingDomain = StrengthDomain.STRATEGIC_THINKING;
    let maxCount = 0;
    
    domainCounts.forEach((count, domain) => {
      if (count > maxCount) {
        maxCount = count;
        leadingDomain = domain;
      }
    });
    
    return leadingDomain;
  }

  /**
   * Create a custom PDF processing error
   */
  private createError(code: PDFProcessingError['code'], message: string, details?: any): PDFProcessingError {
    const error = new Error(message) as PDFProcessingError;
    error.code = code;
    error.details = details;
    return error;
  }
}