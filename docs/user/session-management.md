# Session Management Guide

PeakPath's session management system allows you to maintain multiple coaching profiles and preserve your conversation history across visits.

## 📊 Understanding Sessions

### What is a Session?
A session in PeakPath contains:
- **Strength Profile**: Your CliftonStrengths data from uploaded PDF
- **Coaching History**: All AI coaching conversations
- **UI Preferences**: Dashboard settings and customizations
- **Upload Progress**: Any interrupted file uploads (with recovery)
- **Timestamp Data**: When created and last accessed

### Session Types
1. **Regular Sessions**: Created from PDF uploads
2. **Demo Session**: Pre-loaded sample data
3. **Recovered Sessions**: Restored from interrupted uploads

## 🚀 Creating New Sessions

### From PDF Upload
1. **Upload PDF**: Choose your CliftonStrengths report
2. **Processing**: AI extracts your strengths data
3. **Auto-Creation**: New session created with timestamp name
4. **Ready to Coach**: Dashboard loads with your data

### Session Naming
- **Default**: Timestamp format (e.g., "2025-01-15 14:30")
- **Rename Anytime**: Click session name to edit
- **Descriptive Names**: "Work Profile", "Personal Assessment", etc.

### Multiple Profiles
Create separate sessions for:
- **Different Time Periods**: Retaking CliftonStrengths over time
- **Different Contexts**: Work vs personal assessments
- **Family/Team**: Managing multiple people's profiles
- **Comparison**: Comparing Top 5 vs Full 34 reports

## 🔄 Switching Between Sessions

### Session Selector
1. **Find the Dropdown**: Look for session name in top navigation
2. **View All Sessions**: Click to see complete list
3. **Select Different Session**: Click any session to switch
4. **Instant Loading**: Previous conversations and data load immediately

### Session Information Display
Each session shows:
- **Session Name**: Editable identifier
- **Creation Date**: When session was first created
- **Last Accessed**: Most recent activity
- **Strength Count**: Number of strengths in profile
- **Message Count**: Total coaching conversations

## 💾 Data Persistence

### What Gets Saved
✅ **Strength Profile**: Complete CliftonStrengths data
✅ **Chat History**: All coaching conversations
✅ **Session Settings**: Preferences and customizations
✅ **Upload Recovery**: Partial uploads for resumption
✅ **UI State**: Dashboard layout preferences

### Where Data is Stored
- **Local Storage**: In your browser only
- **No Server Storage**: Your data never leaves your device
- **Per-Browser**: Each browser maintains separate sessions
- **Per-Device**: Mobile and desktop sessions are separate

### Data Persistence Rules
- **Automatic Saving**: Changes saved in real-time
- **Cross-Tab Sync**: Works across multiple browser tabs
- **Refresh Safe**: Data survives browser refresh/restart
- **Private Browsing**: Works but data cleared when session ends

## 🛠️ Session Management Tools

### Renaming Sessions
```
1. Click session name in dropdown or dashboard
2. Type new name (e.g., "Q4 2024 Assessment")
3. Press Enter or click away to save
4. New name appears throughout interface
```

### Session Information
View detailed session data:
- **Creation Date**: When session was first created
- **Data Size**: How much storage session uses
- **Last Activity**: Most recent coaching conversation
- **Strength Details**: Which strengths are in the profile

### Export Session Data
```
1. Select session you want to export
2. Click "Export Data" in session menu
3. Download JSON file with all session data
4. Import later or share with coaches/mentors
```

### Import Session Data
```
1. Click "Import Session" in session dropdown
2. Select previously exported JSON file
3. Session recreated with all data intact
4. Continue coaching where you left off
```

## 🗑️ Cleaning Up Sessions

### Deleting Individual Sessions
1. **Select Session**: Choose session to delete
2. **Session Menu**: Click three-dot menu next to session name
3. **Delete Option**: Select "Delete Session"
4. **Confirm**: Confirm deletion (irreversible)

### Bulk Session Cleanup
- **Delete All**: Remove all sessions at once
- **Delete Expired**: Remove sessions older than 30 days
- **Delete Empty**: Remove sessions without coaching conversations

### Automatic Cleanup
- **30-Day Expiration**: Sessions auto-delete after 30 days of inactivity
- **Storage Limits**: Oldest sessions removed if browser storage full
- **Corruption Recovery**: Damaged sessions automatically cleaned up

## 🔒 Privacy & Security

### Data Location
- **Browser Only**: All data stored locally in your browser
- **No Cloud Storage**: Nothing uploaded to external servers
- **Device Isolation**: Each device has separate session data
- **User Control**: You control all data deletion and export

### Security Features
- **No Account Required**: No login credentials to compromise
- **Local Processing**: AI conversations processed locally when possible
- **Encrypted Storage**: Browser storage encrypted by default
- **Session Isolation**: Sessions cannot access each other's data

### Privacy Controls
- **Incognito Mode**: Works in private browsing (data not persistent)
- **Clear All Data**: One-click complete data removal
- **Selective Deletion**: Remove individual sessions or conversations
- **Export Control**: You decide what data to export/share

## 📱 Cross-Device Considerations

### Device Separation
- **Independent Storage**: Each device maintains its own sessions
- **No Auto-Sync**: Sessions don't automatically sync across devices
- **Manual Transfer**: Use export/import for device transfer

### Mobile vs Desktop
- **Same Features**: Full session management on all devices
- **Responsive Design**: Session interface adapts to screen size
- **Touch Optimized**: Mobile gestures work for session switching

### Sharing Sessions
To use sessions on multiple devices:
1. **Export from Device 1**: Download session JSON
2. **Transfer File**: Email, cloud storage, or direct transfer
3. **Import to Device 2**: Upload JSON to recreate session
4. **Manual Sync**: Repeat process to keep devices updated

## 🔍 Troubleshooting Sessions

### Session Won't Load
**Possible Causes**:
- Browser storage corruption
- Session data incomplete
- Browser compatibility issue

**Solutions**:
1. **Refresh Browser**: Try reloading the page
2. **Clear Cache**: Clear browser cache and cookies
3. **Different Browser**: Test in another browser
4. **Recovery Mode**: Use session recovery tools

### Missing Sessions
**Possible Causes**:
- Browser data cleared
- Different browser/device
- Private browsing mode
- Storage quota exceeded

**Solutions**:
1. **Check Browser Settings**: Verify data storage allowed
2. **Import Backup**: Use previously exported session data
3. **Re-upload PDF**: Create new session from original PDF

### Session Data Corrupted
**Automatic Recovery**:
- System detects corruption
- Attempts automatic repair
- Fallback to last known good state
- User notified of recovery attempt

**Manual Recovery**:
1. **Export Partial Data**: Save what's recoverable
2. **Delete Corrupted Session**: Remove damaged session
3. **Re-import Clean Data**: Import recovered portions
4. **Re-upload PDF**: Start fresh if necessary

### Performance Issues
**Large Session Management**:
- **Archive Old Sessions**: Export and delete inactive sessions
- **Limit Active Sessions**: Keep 5-10 active sessions maximum
- **Clear Chat History**: Remove old conversations if needed
- **Browser Optimization**: Ensure browser has adequate storage

## 📊 Storage Usage Monitoring

### Checking Storage Usage
```
Session Menu > Storage Info
- Total storage used
- Storage per session
- Available space remaining
- Cleanup recommendations
```

### Storage Optimization
- **Regular Cleanup**: Delete unused sessions monthly
- **Export Important Data**: Save key insights externally
- **Compress Large Sessions**: System automatically optimizes storage
- **Monitor Usage**: Check storage usage regularly

## 🎯 Best Practices

### Organization
1. **Descriptive Names**: Use clear, meaningful session names
2. **Regular Cleanup**: Delete unused sessions monthly
3. **Backup Important Sessions**: Export valuable conversations
4. **Consistent Naming**: Use naming convention (e.g., "2024-Q1-Work")

### Workflow
1. **One Session per Assessment**: Don't mix different PDF reports
2. **Rename Immediately**: Give sessions meaningful names after creation
3. **Regular Review**: Check session list monthly
4. **Export Key Insights**: Save important coaching conversations

### Sharing
1. **Export for Coaches**: Share session data with mentors/coaches
2. **Team Comparisons**: Export multiple profiles for team analysis
3. **Progress Tracking**: Export sessions over time to track development
4. **Backup Strategy**: Regular exports as backup

## ❓ Common Questions

**Q: Can I have multiple CliftonStrengths profiles?**
A: Yes! Create separate sessions for different assessments or time periods.

**Q: Do sessions sync across my devices?**
A: No, sessions are device-specific. Use export/import to transfer between devices.

**Q: How long do sessions last?**
A: Sessions are automatically deleted after 30 days of inactivity, but you can extend this.

**Q: Can I recover a deleted session?**
A: No, deletion is permanent. Always export important sessions before deleting.

**Q: Is there a limit to how many sessions I can have?**
A: Limited only by your browser's storage capacity (typically very generous).

**Q: Can others access my sessions?**
A: No, sessions are private to your browser and device only.

---

**Ready to manage your coaching sessions like a pro?**

[![Start Managing Sessions](https://img.shields.io/badge/Start_Managing_Sessions-4285f4?style=for-the-badge)](https://peak-path.vercel.app)

Organize your strengths development journey! 🏆