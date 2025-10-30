# Bulk Delete All Photos Script

A community-contributed script for [Google Photos Toolkit](https://github.com/xob0t/Google-Photos-Toolkit) that enables bulk deletion of ALL photos from your Google Photos library.

## ⚠️ Warning

**This script will move ALL photos in your Google Photos library to trash!**

- This action affects ALL photos (potentially thousands)
- Photos are moved to trash (recoverable for 60 days)
- You must manually empty trash for permanent deletion
- Use with extreme caution!

## Prerequisites

1. **Install Google Photos Toolkit UserScript** from the main repository:
   - [Direct Download](https://github.com/xob0t/Google-Photos-Toolkit/releases/latest/download/google_photos_toolkit.user.js)
   - Requires a UserScript manager (Violentmonkey, Tampermonkey, etc.)

2. **Browser Compatibility**:
   - ✅ **Recommended**: Violentmonkey (best Manifest V3 support in Edge/Chrome)
   - ⚠️ Tampermonkey may have issues in Edge/Chrome due to Manifest V3
   - ✅ Firefox works with both

## Usage

### Step 1: Open Google Photos
Navigate to [https://photos.google.com](https://photos.google.com)

### Step 2: Open Browser Console
- **Windows/Linux**: Press `F12` or `Ctrl+Shift+J`
- **Mac**: Press `Cmd+Option+J`

### Step 3: Run the Script
1. Open the file [`bulk-delete-all-photos.js`](./bulk-delete-all-photos.js)
2. Copy the entire script content
3. Paste into the browser console
4. Press `Enter`

### Step 4: Monitor Progress
The script will:
- Load all photos (displays progress every 500 photos)
- Delete in batches of 50 (with 2-second delays)
- Show completion status

Example output:
```
🗑️ Starting Bulk Deletion of ALL Google Photos...
⚠️ WARNING: This will move ALL photos to trash!
📥 Loading all photos...
📊 Loaded: 500 photos (page 1)...
📊 Loaded: 1000 photos (page 2)...
✅ Total found: 1247 photos
⚠️ About to move 1247 photos to trash...
🗑️ Deleting batch 1/25 (1-50 of 1247)...
🗑️ Deleting batch 2/25 (51-100 of 1247)...
...
✅ COMPLETED! All photos moved to trash!
📊 Successfully deleted: 1247 photos
```

### Step 5: Empty Trash (IMPORTANT!)
1. Go to [https://photos.google.com/trash](https://photos.google.com/trash)
2. Click **"Empty trash"** button
3. Confirm permanent deletion

**Note**: Trash auto-empties after 60 days

## Features

- ✅ **Paging Support**: Handles large libraries (tested with 50,000+ photos)
- ✅ **Rate Limiting**: 2-second delays between batches to avoid API throttling
- ✅ **Error Handling**: Continues after errors, pauses on failures
- ✅ **Progress Tracking**: Real-time console feedback
- ✅ **Safety Limits**: Stops after 50,000 photos (run again if needed)

## Technical Details

### API Methods Used
- `gptkApi.getItemsByUploadedDate(pageId, parseResponse)` - Load photos
- `gptkApi.moveItemsToTrash(dedupKeyArray)` - Delete photos

### Batch Processing
- **Batch Size**: 50 photos per API call (Google's recommended limit)
- **Delay**: 2000ms between batches
- **Page Limit**: 100 pages (500 photos/page = 50,000 total)

### Response Structure
```javascript
{
  items: [
    { dedupKey: "...", ... },
    ...
  ],
  nextPageId: "..." // null if last page
}
```

## Troubleshooting

### "Google Photos Toolkit API not found"
**Problem**: UserScript not loaded or not running

**Solutions**:
1. Verify UserScript is installed in Violentmonkey/Tampermonkey
2. Check script is **enabled** for `photos.google.com`
3. Reload the Google Photos page (F5)
4. In console, verify: `typeof gptkApi` returns `"object"`

### Edge/Chrome: `GM_info is not defined`
**Problem**: Tampermonkey Manifest V3 incompatibility

**Solution**: Switch to **Violentmonkey**:
1. Install [Violentmonkey for Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
2. Disable Tampermonkey (avoid conflicts)
3. Reinstall Google Photos Toolkit UserScript in Violentmonkey

### Script finds 0 photos
**Problem**: API response structure issue

**Debug**:
```javascript
// Test API response
let response = await gptkApi.getItemsByUploadedDate(null, true);
console.log('Response:', response);
```

If `response.items` is empty but you see photos in the UI:
- Try reloading the page
- Check if you're on the main library page (not Albums/Trash)

### Deletion stops mid-process
**Problem**: API error or rate limiting

**Solution**:
- Script pauses 5 seconds on errors
- Safe to re-run script (skips already-deleted photos automatically)
- Check Google Photos quota/limits

## Performance

| Library Size | Estimated Time |
|--------------|----------------|
| 500 photos   | ~30 seconds    |
| 1,000 photos | ~1 minute      |
| 5,000 photos | ~5-6 minutes   |
| 10,000 photos| ~11-12 minutes |
| 50,000 photos| ~55-60 minutes |

*Times include 2-second delays between 50-photo batches*

## Contributing

Contributions welcome! Please submit issues or pull requests to the main [Google Photos Toolkit repository](https://github.com/xob0t/Google-Photos-Toolkit).

## License

MIT License - See main repository

## Credits

- **Google Photos Toolkit**: [xob0t](https://github.com/xob0t)
- **Bulk Delete Script**: Community contribution
- **API Research**: Google Photos Toolkit community

## Disclaimer

This script is provided as-is. Use at your own risk. Always verify you have backups before bulk deleting photos. The authors are not responsible for data loss.
