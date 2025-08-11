# Troubleshooting Guide

Having issues with PeakPath? This comprehensive guide covers common problems and their solutions.

## 🚑 Quick Fixes (Try These First)

### Universal Solutions
1. **Refresh the Page**: Press F5 or Ctrl+R (Cmd+R on Mac)
2. **Clear Browser Cache**: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
3. **Try Another Browser**: Test in Chrome, Firefox, or Safari
4. **Check Internet Connection**: Ensure you're online for AI features
5. **Disable Extensions**: Turn off ad blockers and other extensions temporarily

## 📋 PDF Upload Issues

### PDF Won't Upload

**Problem**: File selection doesn't work or upload fails

**Solutions**:
1. **Check File Format**: Ensure file has `.pdf` extension
2. **File Size Limit**: Keep files under 10MB
3. **Try Different Browser**: Chrome works best for file uploads
4. **Disable Ad Blocker**: Some blockers interfere with file uploads
5. **Check JavaScript**: Ensure JavaScript is enabled

```bash
# Quick file check:
- File format: *.pdf only
- File size: < 10MB
- File source: Official CliftonStrengths report from Gallup
```

### "Invalid PDF" Error

**Problem**: PDF uploads but shows "Invalid PDF" message

**Common Causes**:
- Non-CliftonStrengths PDF (wrong document type)
- Corrupted or encrypted PDF
- Scanned image instead of text-based PDF
- Very old CliftonStrengths format

**Solutions**:
1. **Verify Document**: Ensure it's an official Gallup CliftonStrengths report
2. **Try Demo Mode**: Test with sample data first
3. **Check PDF Text**: Open in Adobe Reader - can you select text?
4. **Re-download**: Get fresh PDF from Gallup if possible
5. **Different Format**: If you have Top 5, try Full 34 or vice versa

### Upload Stalls or Times Out

**Problem**: Upload starts but never completes

**Solutions**:
1. **Check Connection**: Ensure stable internet connection
2. **Smaller File**: Try compressing PDF if very large
3. **Different Time**: Server might be busy - try later
4. **Incognito Mode**: Test in private/incognito browser window
5. **Mobile Hotspot**: Try different internet connection

## 🤖 AI Coaching Problems

### AI Chat Not Responding

**Problem**: Send message but get no response

**Immediate Checks**:
1. **Internet Connection**: AI requires internet connectivity
2. **Service Status**: Check if Claude AI service is operational
3. **Refresh Page**: Reload and try again
4. **Different Question**: Try simpler question first

**Advanced Solutions**:
```bash
# Test API connection:
1. Go to /api/health in your browser
2. Should show: {"status":"healthy","claude":"connected"}
3. If error, wait 5 minutes and try again
```

### Slow AI Responses

**Problem**: AI takes very long to respond

**Normal Response Times**:
- Simple questions: 5-15 seconds
- Complex questions: 15-30 seconds
- Very detailed responses: 30-60 seconds

**If Slower Than Normal**:
1. **Peak Usage**: Try during off-peak hours
2. **Question Complexity**: Simplify your question
3. **Browser Resources**: Close other tabs using CPU
4. **Mobile Connection**: Switch to WiFi if on cellular

### "API Error" Messages

**Problem**: Error messages instead of AI responses

**Common Messages & Solutions**:

**"Rate limit exceeded"**:
- Wait 1 minute and try again
- Service is temporarily busy

**"Service unavailable"**:
- Claude API is down for maintenance
- Check back in 5-10 minutes

**"Invalid request"**:
- Refresh page and try again
- Question might contain invalid characters

## 📱 Mobile Device Issues

### Touch Interface Problems

**Problem**: Buttons or interface elements don't respond to touch

**Solutions**:
1. **Zoom Reset**: Pinch to reset zoom to 100%
2. **Landscape Mode**: Try rotating device
3. **Close Other Apps**: Free up device memory
4. **Restart Browser**: Close and reopen browser app
5. **Update Browser**: Ensure browser is latest version

### Mobile Upload Issues

**Problem**: Can't upload PDF on mobile device

**Solutions**:
1. **Use "Choose File"**: Don't rely on drag-and-drop
2. **Download First**: Download PDF to device before uploading
3. **Different App**: Try different PDF reader app
4. **Desktop Alternative**: Use computer for initial upload

### Small Screen Display

**Problem**: Interface elements too small or cut off

**Solutions**:
1. **Portrait Mode**: Use phone in vertical orientation
2. **Zoom Controls**: Use browser zoom (pinch gestures)
3. **Full Screen**: Hide browser address bar by scrolling
4. **Different Browser**: Try Chrome Mobile or Safari

## 📋 Session & Data Issues

### Sessions Won't Save

**Problem**: Coaching conversations or data not persisting

**Check Storage Settings**:
1. **Private Browsing**: Incognito mode doesn't save data permanently
2. **Storage Quota**: Browser might be out of space
3. **Cookies Disabled**: Enable cookies and local storage
4. **Auto-Clear Settings**: Check if browser auto-clears data

**Solutions**:
```bash
# Enable storage:
1. Browser Settings > Privacy > Cookies > Allow
2. Browser Settings > Storage > Allow sites to save data
3. Disable "Clear data on exit" if enabled
```

### Missing Previous Sessions

**Problem**: Previous coaching sessions disappeared

**Possible Causes**:
- Browser data cleared
- Using different browser/device
- Storage quota exceeded
- 30-day auto-cleanup triggered

**Recovery Options**:
1. **Check Different Browser**: Data might be in another browser
2. **Import Backup**: If you exported sessions previously
3. **Re-upload PDF**: Create new session from original PDF
4. **Check Other Devices**: Sessions don't sync between devices

### Session Data Corrupted

**Problem**: Session loads but data looks wrong or incomplete

**Automatic Recovery**:
- System attempts auto-repair
- Fallback to last known good state
- Notification shown if recovery attempted

**Manual Steps**:
1. **Export What's Left**: Save any recoverable data
2. **Delete Corrupted Session**: Remove damaged session
3. **Start Fresh**: Upload PDF again to create new session
4. **Report Issue**: Help us improve by reporting the corruption

## 🌐 Browser Compatibility

### Supported Browsers

**✅ Fully Supported**:
- Chrome 88+ (Recommended)
- Firefox 84+
- Safari 14+
- Edge 88+

**⚠️ Limited Support**:
- Internet Explorer (use Edge instead)
- Very old browser versions
- Some mobile browsers

### Browser-Specific Issues

**Chrome Issues**:
- Usually the most reliable
- If problems, try clearing Chrome data
- Check for Chrome updates

**Firefox Issues**:
- Enhanced tracking protection might interfere
- Disable strict privacy settings temporarily
- Try Firefox private window

**Safari Issues**:
- Intelligent tracking prevention might block features
- Enable cross-site tracking if needed
- Clear Safari data and restart

**Mobile Safari Issues**:
- Use "Request Desktop Site" if mobile version has problems
- Disable content blockers temporarily
- Clear Safari cache

## ⚡ Performance Issues

### Slow Loading

**Problem**: Pages or features load very slowly

**Optimization Steps**:
1. **Close Other Tabs**: Free up browser memory
2. **Restart Browser**: Fresh start clears memory leaks
3. **Check Extensions**: Disable unnecessary extensions
4. **Clear Cache**: Remove accumulated temporary files
5. **Stable Connection**: Use WiFi instead of cellular

### High CPU Usage

**Problem**: Browser using excessive CPU resources

**Solutions**:
1. **Single Tab**: Use PeakPath in one tab only
2. **Close Background Apps**: Free up system resources
3. **Lower Quality**: If streaming responses are laggy
4. **Restart Device**: Clear system memory

### Memory Issues

**Problem**: "Out of memory" errors or browser crashes

**Prevention**:
1. **Regular Cleanup**: Delete old sessions monthly
2. **Export Important Data**: Keep storage usage low
3. **Browser Restart**: Restart browser daily
4. **System Restart**: Restart device weekly

## 🔍 Advanced Troubleshooting

### Developer Tools Debugging

For technical users:

```bash
# Open Developer Tools:
# Chrome/Firefox: F12 or Ctrl+Shift+I
# Safari: Cmd+Option+I (after enabling Developer menu)

# Check Console for errors:
1. Open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Screenshot errors for support
```

### Network Debugging

```bash
# Check network requests:
1. Developer Tools > Network tab
2. Try problematic action
3. Look for failed requests (red entries)
4. Check if API calls are reaching servers
```

### Storage Debugging

```bash
# Check local storage:
1. Developer Tools > Application tab (Chrome)
2. Local Storage > peak-path.vercel.app
3. See if session data is present
4. Clear specific items if corrupted
```

## 📞 Getting Additional Help

### Self-Service Resources

1. **User Documentation**: [Getting Started Guide](getting-started.md)
2. **Demo Mode**: Test features with sample data
3. **FAQ Section**: Common questions and answers
4. **GitHub Discussions**: Community support and tips

### Reporting Issues

**Before Reporting**:
- Try all troubleshooting steps above
- Test in different browser
- Note exact error messages
- Include browser version and operating system

**GitHub Issues Template**:
```markdown
## Problem Description
[Clear description of the issue]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Error occurs]

## Expected vs Actual Behavior
- Expected: [what should happen]
- Actual: [what actually happens]

## Environment
- Browser: [Chrome 120, Firefox 119, etc.]
- OS: [Windows 11, macOS 14, etc.]
- Device: [Desktop, iPhone, Android tablet, etc.]

## Error Messages
[Exact error text or screenshot]

## Troubleshooting Attempted
[What you've already tried]
```

### Contact Options

1. **GitHub Issues**: [Report Bugs](https://github.com/aporb/PeakPath/issues/new)
2. **GitHub Discussions**: [Ask Questions](https://github.com/aporb/PeakPath/discussions)
3. **Email Support**: For sensitive issues (check GitHub for contact)

## 🔄 Recovery Procedures

### Complete Reset

If nothing else works:

```bash
# Nuclear option - clears all PeakPath data:
1. Browser Settings > Privacy > Clear browsing data
2. Select "All time" and check all boxes
3. Clear data and restart browser
4. Re-visit PeakPath and start fresh
```

### Backup Before Reset

```bash
# Export all sessions first:
1. Go to Session Management
2. Export each important session
3. Save export files to computer
4. After reset, import sessions back
```

## ❓ Frequently Asked Questions

**Q: Why isn't my PDF uploading?**
A: Check file format (must be PDF), size (under 10MB), and ensure it's a CliftonStrengths report from Gallup.

**Q: The AI isn't responding to my questions.**
A: Check your internet connection, try refreshing the page, and ensure the question is clear and appropriate.

**Q: My previous sessions disappeared.**
A: Sessions are stored locally in your browser. Check if you're using the same browser/device and haven't cleared browser data.

**Q: PeakPath is running slowly.**
A: Close other browser tabs, clear cache, and ensure you have a stable internet connection.

**Q: I'm getting "API Error" messages.**
A: This usually indicates a temporary service issue. Wait a few minutes and try again.

**Q: The mobile interface isn't working properly.**
A: Try using the device in portrait mode, ensure you're using an updated browser, and check that JavaScript is enabled.

---

**Still having issues?**

[![Get Help on GitHub](https://img.shields.io/badge/Get_Help_on_GitHub-4285f4?style=for-the-badge&logo=github)](https://github.com/aporb/PeakPath/issues)

We're here to help! 🚀