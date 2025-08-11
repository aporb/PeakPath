# Vercel Deployment Guide

## 🚀 Quick Deploy

Your PeakPath application is **100% configured for Vercel deployment**. Here's everything you need:

### ✅ Pre-configured Components

- **Vercel Configuration**: `vercel.json` routes API calls correctly
- **Build Optimization**: Optimized for edge runtime
- **API Routes**: Health check, upload, and coaching endpoints ready
- **Environment Setup**: Secure API key handling configured

### 🎯 Deployment Commands

#### Option 1: Automatic Deploy (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to your account
vercel login

# 3. Deploy from root directory
cd /path/to/PeakPath
vercel --prod

# 4. Set your API key
vercel env add CLAUDE_API_KEY
# Enter your Anthropic API key when prompted

# 5. Redeploy with environment variables
vercel --prod
```

#### Option 2: GitHub Integration
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add `CLAUDE_API_KEY` environment variable
4. Deploy automatically

### 🔧 Environment Variables

**Required:**
```bash
CLAUDE_API_KEY=sk-ant-api03-...your_key_here
```

**Optional (with defaults):**
```bash
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7
```

### 📋 Project Structure

```
PeakPath/
├── 📁 frontend/           (Next.js app - gets deployed)
│   ├── src/app/api/      (Serverless API routes)
│   ├── src/lib/services/ (Claude + PDF services)
│   └── package.json      (All dependencies included)
├── vercel.json           (Deployment config)
├── .env.example          (Template for env vars)
└── README.md             (Project overview)
```

### ✨ Features Ready for Production

✅ **Full-stack deployment** - Frontend + API combined  
✅ **PDF upload & parsing** - CliftonStrengths reports  
✅ **AI coaching chat** - Claude integration with streaming  
✅ **Mobile responsive** - Works on all devices  
✅ **Production optimized** - Error handling, rate limiting  
✅ **Secure configuration** - Environment variables for API keys  

### 🎉 Post-Deployment Features

1. **PDF Upload** - Users upload CliftonStrengths reports
2. **AI Analysis** - Strengths extracted and analyzed  
3. **Coaching Chat** - Interactive conversations about strengths
4. **Streaming Responses** - Real-time AI responses
5. **Mobile Support** - Works perfectly on phones/tablets

### 🔧 Troubleshooting

If deployment fails:
1. Check that `CLAUDE_API_KEY` is set correctly
2. Verify your Anthropic API key has credits
3. Check Vercel function logs for errors
4. Ensure you're deploying from the root directory

### 📞 Need Help?

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PeakPath GitHub Issues](https://github.com/aporb/PeakPath/issues)

---

**Ready to deploy?** Run: `vercel --prod`

Your coaching app will be live at `https://your-project-name.vercel.app` 🎉