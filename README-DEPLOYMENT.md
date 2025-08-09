# PeakPath Deployment Guide

## Vercel Deployment

This project is configured for easy deployment on Vercel with API routes.

### Quick Deployment

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI if not installed
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from root directory
   vercel --prod
   ```

2. **Set Environment Variables**
   In your Vercel dashboard or via CLI:
   ```bash
   vercel env add CLAUDE_API_KEY
   # Enter your Anthropic API key when prompted
   ```

### Environment Variables

Required environment variables:

- `CLAUDE_API_KEY` - Your Anthropic API key
- `CLAUDE_MODEL` - Model to use (default: claude-3-5-sonnet-20241022)
- `CLAUDE_MAX_TOKENS` - Max tokens per response (default: 4096)
- `CLAUDE_TEMPERATURE` - Response temperature (default: 0.7)

### Project Structure

```
PeakPath/
├── frontend/                 # Next.js app (deployed to Vercel)
│   ├── src/app/api/         # Vercel API routes
│   │   ├── health/          # Health check endpoint
│   │   ├── upload/          # PDF upload handler
│   │   └── coach/           # Chat endpoints
│   ├── src/lib/services/    # Backend services (Claude, PDF parser)
│   └── package.json
├── vercel.json              # Vercel configuration
└── .env.example             # Environment variables template
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - Upload PDF for analysis  
- `POST /api/coach` - Chat with AI coach
- `POST /api/coach/stream` - Streaming chat

### Features

✅ **Frontend & Backend Combined** - Single Vercel deployment  
✅ **File Upload** - PDF processing with edge-compatible parser  
✅ **AI Coaching** - Claude integration with streaming  
✅ **Production Ready** - Error handling, rate limiting, validation  
✅ **Environment Variables** - Secure configuration management  

### Manual Deployment Steps

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/aporb/PeakPath.git
   cd PeakPath
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   # Copy example file
   cp .env.example .env.local
   
   # Edit with your API key
   nano .env.local
   ```

4. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:8000
   ```

5. **Deploy to Vercel**
   ```bash
   # From root directory
   vercel --prod
   ```

### Production Considerations

- **File Storage**: PDFs are processed in memory (no persistent storage)
- **Database**: Currently stateless (no database persistence in production)
- **Rate Limiting**: Built-in Claude API rate limiting
- **Security**: Environment variables for API keys
- **Performance**: Edge-optimized API routes

### Troubleshooting

1. **Build Errors**: Check dependencies in `frontend/package.json`
2. **API Errors**: Verify `CLAUDE_API_KEY` is set correctly
3. **Upload Issues**: Ensure PDF files are valid CliftonStrengths reports
4. **Performance**: Check Vercel function logs for timeout issues