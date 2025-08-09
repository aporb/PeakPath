import { NextRequest, NextResponse } from 'next/server';
import { CliftonStrengthsPDFParser } from '../../../lib/services/cliftonStrengthsPDFParser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded', message: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type', message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    console.log('File uploaded, parsing PDF:', file.name);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse the PDF using our CliftonStrengths parser
    const parser = new CliftonStrengthsPDFParser();
    const parseResult = await parser.parsePDFFromBuffer(buffer);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Failed to parse PDF',
          message: parseResult.error || 'Unable to extract CliftonStrengths data from PDF'
        },
        { status: 400 }
      );
    }

    const profile = parseResult.data!;

    // Transform backend format to frontend format
    const domainMapping: Record<string, string> = {
      'Executing': 'executing',
      'Influencing': 'influencing', 
      'Relationship Building': 'relationship-building',
      'Strategic Thinking': 'strategic-thinking'
    };

    const strengthsWithIds = profile.strengths.map((strength) => ({
      id: `${profile.name.replace(/\s+/g, '_').toLowerCase()}_${strength.name.toLowerCase()}`,
      name: strength.name,
      domain: domainMapping[strength.domain] || strength.domain.toLowerCase().replace(/\s+/g, '-'),
      rank: strength.rank,
      description: strength.description || '',
      isTopFive: strength.rank <= 5
    }));

    const frontendProfile = {
      id: `assessment_${Date.now()}`, // Generate assessment ID
      userId: `user_${profile.name.replace(/\s+/g, '_').toLowerCase()}`,
      strengths: strengthsWithIds,
      assessmentDate: profile.assessmentDate,
      reportUrl: `temp_${Date.now()}`,
      fullPDFContent: parseResult.fullTextContent // Include for comprehensive AI analysis
    };

    console.log(`Successfully parsed ${profile.strengths.length} strengths for ${profile.name}`);
    
    // Debug logging to track duplicate issues
    console.log('Raw backend strengths:', profile.strengths.slice(0, 5).map(s => ({
      name: s.name, 
      domain: s.domain, 
      rank: s.rank
    })));
    
    console.log('Transformed frontend strengths:', frontendProfile.strengths.slice(0, 5).map(s => ({
      name: s.name, 
      domain: s.domain, 
      rank: s.rank,
      id: s.id
    })));
    
    // Check for duplicates
    const strengthNames = frontendProfile.strengths.map(s => s.name);
    const uniqueNames = [...new Set(strengthNames)];
    if (strengthNames.length !== uniqueNames.length) {
      console.error('DUPLICATE STRENGTHS DETECTED:', {
        total: strengthNames.length,
        unique: uniqueNames.length,
        duplicates: strengthNames.filter((name, index) => strengthNames.indexOf(name) !== index)
      });
    }

    return NextResponse.json(frontendProfile);

  } catch (error) {
    console.error('Error processing PDF upload:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}