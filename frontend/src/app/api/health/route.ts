import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'PeakPath Backend',
      environment: process.env.NODE_ENV || 'development',
      claude: !!process.env.CLAUDE_API_KEY,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
}