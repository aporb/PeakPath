/**
 * AI-Powered CliftonStrengths PDF Parser
 * Uses Claude AI to intelligently extract data from CliftonStrengths PDFs
 */

interface AIExtractionResult {
  success: boolean;
  data?: {
    userName: string;
    assessmentDate: string;
    strengths: Array<{
      name: string;
      rank: number;
      description?: string;
    }>;
    reportType: 'Top 5' | 'Top 10' | 'Full 34';
    additionalInfo?: {
      email?: string;
      completionDate?: string;
      reportId?: string;
      organization?: string;
      language?: string;
    };
  };
  error?: string;
}

export class AIPDFParser {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Extract CliftonStrengths data using AI
   */
  async extractDataWithAI(pdfText: string): Promise<AIExtractionResult> {
    if (!this.apiKey) {
      console.warn('CLAUDE_API_KEY not found, falling back to regex parsing');
      return {
        success: false,
        error: 'AI extraction not available - API key missing'
      };
    }

    try {
      const prompt = this.buildExtractionPrompt(pdfText);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      const aiResponse = result.content[0].text;

      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI extraction failed:', error);
      return {
        success: false,
        error: `AI extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Build the extraction prompt for AI
   */
  private buildExtractionPrompt(pdfText: string): string {
    return `Please analyze this CliftonStrengths PDF report and extract ALL the user information and assessment data. Return your response as a JSON object with the exact structure shown below.

PDF Content:
${pdfText.substring(0, 10000)} ${pdfText.length > 10000 ? '...[truncated]' : ''}

Please extract:
1. The user's full name (the person who took the assessment)
2. The assessment/completion date 
3. All strengths with their rankings (1-5 for Top 5, 1-10 for Top 10, or 1-34 for Full)
4. The report type (Top 5, Top 10, or Full 34)
5. Any additional user information available (email, organization, etc.)

Return ONLY a valid JSON object in this exact format:
{
  "success": true,
  "userName": "First Last Name",
  "assessmentDate": "YYYY-MM-DD",
  "reportType": "Top 5",
  "strengths": [
    {
      "name": "Achiever",
      "rank": 1,
      "description": "Brief description if available from the report"
    }
  ],
  "additionalInfo": {
    "email": "user@example.com",
    "completionDate": "YYYY-MM-DD",
    "reportId": "ABC123",
    "organization": "Company Name",
    "language": "English"
  }
}

If you cannot extract the information, return:
{
  "success": false,
  "error": "Description of what went wrong"
}

Important guidelines:
- Look for the person's actual name, not generic text like "Sample Report" or "User"
- Extract ALL strengths shown in the report with their exact rankings
- Use standard CliftonStrengths strength names (e.g., "Achiever", "Strategic", "Empathy", "Learner")
- Include any additional user details you can find (email, organization, completion date, etc.)
- If you find strength descriptions in the PDF, include them
- Return ONLY the JSON object, no additional text or formatting`;
  }

  /**
   * Parse the AI response into structured data
   */
  private parseAIResponse(aiResponse: string): AIExtractionResult {
    try {
      // Clean the response to extract just the JSON
      let jsonStr = aiResponse.trim();
      
      // Remove any markdown code blocks
      jsonStr = jsonStr.replace(/```json\s*/, '').replace(/```\s*$/, '');
      
      // Find JSON object boundaries
      const startIdx = jsonStr.indexOf('{');
      const endIdx = jsonStr.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1) {
        throw new Error('No valid JSON found in AI response');
      }
      
      jsonStr = jsonStr.substring(startIdx, endIdx + 1);
      
      const parsed = JSON.parse(jsonStr);
      
      if (!parsed.success) {
        return {
          success: false,
          error: parsed.error || 'AI extraction failed'
        };
      }

      // Validate the structure
      if (!parsed.userName || !parsed.strengths || !Array.isArray(parsed.strengths)) {
        throw new Error('Invalid data structure from AI response');
      }

      return {
        success: true,
        data: {
          userName: parsed.userName,
          assessmentDate: parsed.assessmentDate || new Date().toISOString().split('T')[0],
          strengths: parsed.strengths.map((s: any) => ({
            name: s.name,
            rank: s.rank,
            description: s.description || ''
          })),
          reportType: parsed.reportType || this.determineReportType(parsed.strengths.length)
        }
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        success: false,
        error: `Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Determine report type based on number of strengths
   */
  private determineReportType(strengthCount: number): 'Top 5' | 'Top 10' | 'Full 34' {
    if (strengthCount >= 30) return 'Full 34';
    if (strengthCount >= 8) return 'Top 10';
    return 'Top 5';
  }
}