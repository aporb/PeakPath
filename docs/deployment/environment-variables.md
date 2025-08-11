# Environment Variables

PeakPath requires specific environment variables for proper operation. This guide covers all configuration options for development and production.

## 🔑 Required Variables

### CLAUDE_API_KEY
**Required for all environments**

```bash
CLAUDE_API_KEY=sk-ant-api03-your-key-here
```

- **Purpose**: Authenticates with Anthropic's Claude API for AI coaching
- **Where to get it**: [Anthropic Console](https://console.anthropic.com/)
- **Format**: Starts with `sk-ant-api03-`
- **Security**: Never commit this to version control

## ⚙️ Optional Variables (with defaults)

### CLAUDE_MODEL
**Default**: `claude-3-5-sonnet-20241022`

```bash
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Available models:**
- `claude-3-5-sonnet-20241022` (Recommended - latest Sonnet)
- `claude-3-opus-20240229` (Most capable, slower)
- `claude-3-haiku-20240307` (Fastest, less capable)

### CLAUDE_MAX_TOKENS
**Default**: `4096`

```bash
CLAUDE_MAX_TOKENS=4096
```

- **Purpose**: Maximum tokens per AI response
- **Range**: 1-8192 (varies by model)
- **Impact**: Higher = longer responses, more API cost

### CLAUDE_TEMPERATURE
**Default**: `0.7`

```bash
CLAUDE_TEMPERATURE=0.7
```

- **Purpose**: Controls AI response creativity
- **Range**: 0.0 (deterministic) to 1.0 (creative)
- **Recommendation**: 0.7 for balanced coaching responses

## 📝 Environment Setup

### Development (.env.local)

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
echo "CLAUDE_API_KEY=your-key-here" >> .env.local
echo "NODE_ENV=development" >> .env.local
```

### Production (Vercel)

#### Via Vercel CLI
```bash
# Add environment variable
vercel env add CLAUDE_API_KEY
# Enter your API key when prompted

# Add with value directly
vercel env add CLAUDE_MODEL claude-3-5-sonnet-20241022
```

#### Via Vercel Dashboard
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `CLAUDE_API_KEY` with your key
4. Deploy or redeploy to apply changes

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
env:
  CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
  CLAUDE_MODEL: claude-3-5-sonnet-20241022
```

Add `CLAUDE_API_KEY` to GitHub repository secrets.

## 🔒 Security Best Practices

### ✅ Do
- Use environment variables for all secrets
- Add `.env.local` to `.gitignore`
- Rotate API keys regularly
- Use different keys for dev/staging/production
- Monitor API usage in Anthropic Console

### ❌ Don't
- Commit API keys to version control
- Share API keys in chat/email
- Use production keys in development
- Log environment variables
- Include keys in error messages

## 🔍 Validation

### Check Environment Variables

```bash
# In development
npm run dev
# Check console for "API Configuration: ✅ Valid"

# Test API endpoint
curl http://localhost:8000/api/health
# Should return: {"status":"healthy","claude":"connected"}
```

### Common Issues

**"API key not found" error:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify key format
echo $CLAUDE_API_KEY | head -c 20
# Should show: sk-ant-api03-
```

**"Invalid model" error:**
```bash
# Check model name spelling
echo $CLAUDE_MODEL
# Should be exact: claude-3-5-sonnet-20241022
```

## 📋 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLAUDE_API_KEY` | ✅ Yes | - | Anthropic API key |
| `CLAUDE_MODEL` | ❌ No | `claude-3-5-sonnet-20241022` | Claude model to use |
| `CLAUDE_MAX_TOKENS` | ❌ No | `4096` | Max tokens per response |
| `CLAUDE_TEMPERATURE` | ❌ No | `0.7` | Response creativity (0-1) |
| `NODE_ENV` | ❌ No | `development` | Node environment |

---

## 🚀 Quick Setup Commands

**Development:**
```bash
cp .env.example .env.local
echo "CLAUDE_API_KEY=your-key-here" >> .env.local
npm run dev
```

**Production (Vercel):**
```bash
vercel env add CLAUDE_API_KEY
vercel --prod
```

Need help? Check the [troubleshooting guide](../user/troubleshooting.md) or [create an issue](https://github.com/aporb/PeakPath/issues).