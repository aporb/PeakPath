import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Import services
import { 
  createCliftonStrengthsParser, 
  createClaudeCoachingService,
  CoachingRequestType 
} from './services';
import { CliftonStrengthsPDFParser } from './services/cliftonStrengthsPDFParser';
import { getDatabaseService } from './services/databaseService';
import type { 
  CoachingRequest, 
  AnalysisRequest, 
  ServiceError 
} from './types/coaching';
import { 
  convertUserProfileToDb, 
  convertDbToUserProfile,
  convertFrontendChatToDb,
  convertDbToFrontendChat,
  CreateUserRequest,
  CreateSessionRequest
} from './types/database';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const cliftonParser = createCliftonStrengthsParser();
const dbService = getDatabaseService();
let claudeCoachingService: ReturnType<typeof createClaudeCoachingService> | null = null;

// Initialize Claude service if API key is available
if (process.env.CLAUDE_API_KEY) {
  try {
    claudeCoachingService = createClaudeCoachingService(process.env.CLAUDE_API_KEY, {
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
      temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7')
    });
    console.log('✅ Claude coaching service initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Claude service:', error);
  }
} else {
  console.warn('⚠️  CLAUDE_API_KEY not found. Claude features will be unavailable.');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Routes

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const dbStats = await dbService.getStats();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'PeakPath Backend',
      database: dbStats
    });
  } catch (error) {
    console.error('Error getting database stats:', error);
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'PeakPath Backend',
      database: { error: 'Could not connect to database' }
    });
  }
});

// Database stats endpoint
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = await dbService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting database stats:', error);
    res.status(500).json({
      error: 'Database error',
      message: 'Could not retrieve database statistics'
    });
  }
});

// PDF Upload endpoint
app.post('/api/upload', upload.single('pdf'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please upload a PDF file'
      });
    }

    console.log('File uploaded, parsing PDF:', req.file.originalname);

    // Parse the PDF using our CliftonStrengths parser
    const parser = new CliftonStrengthsPDFParser();
    const parseResult = await parser.parsePDFFromPath(req.file.path);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Failed to parse PDF',
        message: parseResult.error || 'Unable to extract CliftonStrengths data from PDF'
      });
    }

    const profile = parseResult.data!; // We've already checked parseResult.success
    
    try {
      // Create or get user (for now, use name as unique identifier)
      const userId = `user_${profile.name.replace(/\s+/g, '_').toLowerCase()}`;
      let user = await dbService.getUserById(userId);
      
      if (!user) {
        user = await dbService.createUser({
          id: userId,
          name: profile.name
        });
        console.log(`Created new user: ${profile.name}`);
      }

      // Save assessment to database
      const dbAssessment = convertUserProfileToDb(profile, userId, req.file.path);
      await dbService.saveAssessment(dbAssessment);
      console.log(`Saved assessment for ${profile.name}`);

      // Transform backend format to frontend format
      const strengthsWithIds = profile.strengths.map((strength, index) => ({
        id: `${profile.name.replace(/\s+/g, '_').toLowerCase()}_${strength.name.toLowerCase()}`,
        name: strength.name,
        domain: strength.domain.toLowerCase().replace(/\s+/g, '-'), // Convert to frontend format
        rank: strength.rank,
        description: strength.description || '',
        isTopFive: strength.rank <= 5
      }));

      const frontendProfile = {
        id: dbAssessment.id, // Use database assessment ID
        userId: userId,
        strengths: strengthsWithIds,
        assessmentDate: profile.assessmentDate,
        reportUrl: req.file.path
      };

      console.log(`Successfully parsed ${profile.strengths.length} strengths for ${profile.name}`);

      res.json(frontendProfile);
    } catch (dbError) {
      console.error('Database error during upload:', dbError);
      // Continue without database for now, but log the error
      
      // Transform backend format to frontend format (fallback)
      const strengthsWithIds = profile.strengths.map((strength, index) => ({
        id: `${profile.name.replace(/\s+/g, '_').toLowerCase()}_${strength.name.toLowerCase()}`,
        name: strength.name,
        domain: strength.domain.toLowerCase().replace(/\s+/g, '-'),
        rank: strength.rank,
        description: strength.description || '',
        isTopFive: strength.rank <= 5
      }));

      const frontendProfile = {
        id: `temp_${Date.now()}`,
        userId: 'temp_user',
        strengths: strengthsWithIds,
        assessmentDate: profile.assessmentDate,
        reportUrl: req.file.path
      };

      res.json(frontendProfile);
    }
  } catch (error) {
    console.error('Error processing PDF upload:', error);
    next(error);
  }
});

// Strengths Analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileId, analysisType }: AnalysisRequest = req.body;

    if (!fileId) {
      return res.status(400).json({
        error: 'Missing file ID',
        message: 'File ID is required for analysis'
      });
    }

    // Check if Claude service is available
    if (!claudeCoachingService) {
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Claude coaching service is not configured. Please check your CLAUDE_API_KEY environment variable.'
      });
    }

    // Find the uploaded file
    const filePath = path.join(uploadsDir, fileId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file could not be found'
      });
    }

    console.log('Analyzing file:', fileId, 'Type:', analysisType);

    try {
      // Step 1: Parse the PDF to extract strengths profile
      const parseResult = await cliftonParser.parsePDFFromPath(filePath);
      
      if (!parseResult.success || !parseResult.data) {
        return res.status(400).json({
          error: 'PDF parsing failed',
          message: parseResult.error || 'Could not extract strengths data from PDF'
        });
      }

      const strengthsProfile = parseResult.data;
      
      // Step 2: Use Claude to analyze the strengths profile
      const analysisResult = await claudeCoachingService.analyzeStrengthsProfile(
        { fileId, analysisType }, 
        strengthsProfile
      );

      console.log('Analysis completed for:', strengthsProfile.name);

      res.json({
        message: 'Analysis completed successfully',
        analysis: analysisResult,
        profile: {
          name: strengthsProfile.name,
          assessmentDate: strengthsProfile.assessmentDate,
          format: strengthsProfile.format,
          topFiveStrengths: strengthsProfile.topFive.map(s => s.name)
        }
      });

    } catch (serviceError) {
      console.error('Service error during analysis:', serviceError);
      
      if (serviceError instanceof Error && 'code' in serviceError) {
        const error = serviceError as ServiceError;
        const statusCode = error.statusCode || 500;
        
        return res.status(statusCode).json({
          error: error.code,
          message: error.message
        });
      }

      throw serviceError;
    }

  } catch (error) {
    console.error('Unexpected error in analysis:', error);
    next(error);
  }
});

// Coaching Chat endpoint
app.post('/api/coach', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      message, 
      context, 
      sessionId, 
      type = CoachingRequestType.GENERAL_CHAT,
      strengthsProfile,
      focusArea,
      profileId,
      strengthContext
    }: CoachingRequest & { profileId?: string; strengthContext?: string } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Missing message',
        message: 'Message is required for coaching chat'
      });
    }

    // Check if Claude service is available
    if (!claudeCoachingService) {
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Claude coaching service is not configured. Please check your CLAUDE_API_KEY environment variable.'
      });
    }

    console.log('Coaching request:', { message, type, sessionId, hasProfile: !!strengthsProfile });

    try {
      let currentSessionId = sessionId;
      
      // Create or find chat session if we have user context
      if (profileId && !currentSessionId) {
        try {
          // Try to find user by profileId (which might be assessment ID or user ID)
          let userId = profileId;
          if (profileId.startsWith('assessment_')) {
            // If profileId is an assessment ID, get the user from the assessment
            const assessment = await dbService.getAssessmentById(profileId);
            userId = assessment?.user_id || 'temp_user';
          }
          
          // Create new chat session
          const newSession = await dbService.createChatSession({
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`,
            user_id: userId,
            assessment_id: profileId.startsWith('assessment_') ? profileId : undefined,
            session_name: strengthContext ? `Chat about ${strengthContext}` : 'General coaching session'
          });
          
          currentSessionId = newSession.id;
          console.log(`Created new chat session: ${currentSessionId}`);
        } catch (dbError) {
          console.error('Error creating chat session:', dbError);
          // Continue without database persistence for this request
          currentSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
        }
      }

      // Create coaching request
      const coachingRequest: CoachingRequest = {
        type,
        message,
        strengthsProfile,
        sessionId: currentSessionId,
        context,
        focusArea
      };

      // Save user message to database if we have a session
      if (currentSessionId && !currentSessionId.startsWith('temp_')) {
        try {
          await dbService.saveChatMessage({
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            session_id: currentSessionId,
            sender: 'user',
            content: message,
            strength_context: strengthContext
          });
        } catch (dbError) {
          console.error('Error saving user message:', dbError);
        }
      }

      // Generate coaching response using Claude
      const coachingResponse = await claudeCoachingService.generateCoachingResponse(coachingRequest);

      // Save coach response to database if we have a session
      if (currentSessionId && !currentSessionId.startsWith('temp_')) {
        try {
          await dbService.saveChatMessage({
            id: `coach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            session_id: currentSessionId,
            sender: 'coach',
            content: coachingResponse.response,
            strength_context: strengthContext,
            metadata: JSON.stringify({
              type: coachingResponse.type,
              confidence: coachingResponse.confidence,
              suggestions: coachingResponse.suggestions,
              followUpQuestions: coachingResponse.followUpQuestions
            })
          });
        } catch (dbError) {
          console.error('Error saving coach message:', dbError);
        }
      }

      console.log('Coaching response generated for session:', coachingResponse.sessionId);

      res.json({
        message: 'Coach response generated successfully',
        coach: coachingResponse
      });

    } catch (serviceError) {
      console.error('Service error during coaching:', serviceError);
      
      if (serviceError instanceof Error && 'code' in serviceError) {
        const error = serviceError as ServiceError;
        const statusCode = error.statusCode || 500;
        
        return res.status(statusCode).json({
          error: error.code,
          message: error.message
        });
      }

      throw serviceError;
    }

  } catch (error) {
    console.error('Unexpected error in coaching:', error);
    next(error);
  }
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', error);

  // Handle multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
  }

  // Handle custom errors
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF files are allowed'
    });
  }

  // Generic error response
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PeakPath Backend Server is running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`🔍 Analysis endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`💬 Coaching endpoint: http://localhost:${PORT}/api/coach`);
});

export default app;