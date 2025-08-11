# API Reference

*This documentation is currently being developed.*

PeakPath provides several API endpoints for AI coaching and file processing.

## Available Endpoints

### Health Check
`GET /api/health`

Returns the health status of the API and Claude AI connection.

### File Upload
`POST /api/upload`

Processes CliftonStrengths PDF files and extracts strength data.

### AI Coaching
`POST /api/coach`

Provides AI coaching responses based on user questions and strength context.

### Streaming Responses
`POST /api/coach/stream`

Real-time streaming AI responses using Server-Sent Events.

---

**🚧 This documentation is being expanded. Check back soon for detailed API documentation with examples, request/response schemas, and integration guides.**

For now, refer to the [Development Guide](development.md) for setup instructions and the source code in `/frontend/src/app/api/` for implementation details.