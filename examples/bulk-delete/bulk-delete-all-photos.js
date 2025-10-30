/**
 * Bulk Delete ALL Photos - Google Photos Toolkit Extension
 * 
 * This script deletes ALL photos from your Google Photos library.
 * ⚠️ WARNING: This action CANNOT be undone!
 * 
 * Usage:
 * 1. Install Google Photos Toolkit UserScript
 * 2. Go to https://photos.google.com
 * 3. Open Browser Console (F12)
 * 4. Paste and run this script
 * 5. After completion, manually empty trash at https://photos.google.com/trash
 * 
 * GitHub: https://github.com/xob0t/Google-Photos-Toolkit
 * Author: Community contribution
 * License: MIT
 */

(async function bulkDeleteAllPhotos() {
  // Check if gptkApi is available
  if (typeof gptkApi === 'undefined' || !gptkApi) {
    console.error('❌ Google Photos Toolkit API not found!');
    console.error('Please install the UserScript first: https://github.com/xob0t/Google-Photos-Toolkit');
    return;
  }

  console.log('🗑️ Starting Bulk Deletion of ALL Google Photos...');
  console.warn('⚠️ WARNING: This will move ALL photos to trash!');
  
  let allItems = [];
  let pageId = null;
  let pageCount = 0;
  
  // Load ALL photos (with paging)
  console.log('📥 Loading all photos...');
  
  try {
    do {
      let response = await gptkApi.getItemsByUploadedDate(pageId, true);
      
      if (!response || !response.items || response.items.length === 0) {
        break;
      }
      
      allItems = allItems.concat(response.items);
      pageId = response.nextPageId;
      pageCount++;
      
      console.log(`📊 Loaded: ${allItems.length} photos (page ${pageCount})...`);
      
      // Safety limit: Stop after 100 pages (50,000 photos)
      if (pageCount >= 100) {
        console.warn('⚠️ Reached safety limit of 100 pages (50,000 photos)');
        console.warn('If you need to delete more, run the script again after this batch');
        break;
      }
    } while (pageId);
    
    console.log(`✅ Total found: ${allItems.length} photos`);
    
    if (allItems.length === 0) {
      console.log('ℹ️ No photos found in library!');
      return;
    }
    
    // Confirm deletion
    console.log(`⚠️ About to move ${allItems.length} photos to trash...`);
    
    // Extract dedupKeys (required for deletion API)
    let dedupKeys = allItems.map(item => item.dedupKey);
    
    // Delete in batches of 50 (API limit)
    let batchSize = 50;
    let deletedCount = 0;
    
    for (let i = 0; i < dedupKeys.length; i += batchSize) {
      let batch = dedupKeys.slice(i, i + batchSize);
      let currentBatch = Math.floor(i / batchSize) + 1;
      let totalBatches = Math.ceil(dedupKeys.length / batchSize);
      
      console.log(`🗑️ Deleting batch ${currentBatch}/${totalBatches} (${i + 1}-${Math.min(i + batchSize, dedupKeys.length)} of ${dedupKeys.length})...`);
      
      try {
        await gptkApi.moveItemsToTrash(batch);
        deletedCount += batch.length;
        
        // Rate limiting: 2 second pause between batches
        if (i + batchSize < dedupKeys.length) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (error) {
        console.error(`❌ Error deleting batch ${currentBatch}:`, error);
        console.log(`⏸️ Pausing for 5 seconds before continuing...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    
    console.log('✅ COMPLETED! All photos moved to trash!');
    console.log(`📊 Successfully deleted: ${deletedCount} photos`);
    console.log('');
    console.log('⚠️ IMPORTANT: Photos are in trash, not permanently deleted!');
    console.log('👉 Go to https://photos.google.com/trash');
    console.log('👉 Click "Empty trash" to permanently delete');
    console.log('');
    console.log('Note: Trash is automatically emptied after 60 days');
    
  } catch (error) {
    console.error('❌ Fatal error during deletion:', error);
    console.log('Script stopped. You may need to run it again.');
  }
})();
