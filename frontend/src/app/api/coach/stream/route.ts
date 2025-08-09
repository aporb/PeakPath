import { NextRequest, NextResponse } from 'next/server';
import { createClaudeCoachingService } from '../../../../lib/services/claudeCoachingService';
import { CoachingRequestType } from '../../../../lib/types/coaching';
import type { CoachingRequest } from '../../../../lib/types/coaching';

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      context,
      sessionId,
      type = CoachingRequestType.GENERAL_CHAT,
      strengthsProfile,
      focusArea,
      profileId,
      strengthContext,
      fullPDFContent
    }: CoachingRequest & { profileId?: string; strengthContext?: string } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message', message: 'Message is required for coaching chat' },
        { status: 400 }
      );
    }

    // Check if Claude service is available
    if (!process.env.CLAUDE_API_KEY) {
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'Claude coaching service is not configured. Please check your CLAUDE_API_KEY environment variable.'
        },
        { status: 500 }
      );
    }

    console.log('Streaming coaching request:', { message, type, sessionId, hasProfile: !!strengthsProfile });

    try {
      // Create Claude coaching service with Sonnet 4 and enhanced context
      const claudeCoachingService = createClaudeCoachingService(process.env.CLAUDE_API_KEY, {
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '8000'), // Increased for 200K context window
        temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7')
      });

      // Generate session ID if not provided
      const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;

      // Create coaching request with full PDF content for comprehensive analysis
      const coachingRequest: CoachingRequest = {
        type,
        message,
        strengthsProfile,
        sessionId: currentSessionId,
        context,
        focusArea,
        fullPDFContent // Include full PDF text for deeper insights
      };

      // Create a readable stream
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Generate streaming coaching response using Claude
            const streamGenerator = await claudeCoachingService.generateStreamingCoachingResponse(coachingRequest);

            for await (const chunk of streamGenerator) {
              controller.enqueue(encoder.encode(chunk));
            }
            
            controller.close();
            console.log('Streaming coaching response completed for session:', currentSessionId);
          } catch (error) {
            console.error('Error in stream:', error);
            const errorMessage = `\n\nError: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
            controller.enqueue(encoder.encode(errorMessage));
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control'
        }
      });

    } catch (serviceError: any) {
      console.error('Service error during streaming coaching:', serviceError);

      if (serviceError?.code) {
        const statusCode = serviceError.statusCode || 500;
        return NextResponse.json(
          {
            error: serviceError.code,
            message: serviceError.message
          },
          { status: statusCode }
        );
      }

      throw serviceError;
    }

  } catch (error) {
    console.error('Unexpected error in streaming coaching:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}