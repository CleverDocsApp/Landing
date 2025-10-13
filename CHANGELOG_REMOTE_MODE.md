# Remote Mode Fix - Changelog

## Summary
Fixed the issue where videos saved through the admin panel were not appearing in the public `/ok-how-to` page. The problem was that Remote Mode was disabled by default and the toggle did not persist across page refreshes.

## Changes Made

### 1. Enhanced Runtime Configuration (`src/config/okhowto.runtime.ts`)
- **Added localStorage persistence**: Remote mode preference is now saved to localStorage
- **Added VITE_REMOTE_ENABLED support**: Reads default value from environment variable
- **Backward compatibility**: Exported `toggleRemoteMode` as alias to `setRemoteMode`
- **Result**: Remote mode setting persists across page reloads and browser sessions

### 2. Created Data Normalization Utility (`src/utils/okhowto/normalize.ts`)
- **New helper functions**: `ensureId()` and `normalizeList()`
- **Purpose**: Ensures consistent data structure between local JSON and remote feed
- **Key feature**: Falls back from `vimeoId` to `id` field for consistent rendering
- **Handles**: Both `thumb` and `thumbUrl` field variations

### 3. Updated Public Page (`src/pages/OkHowToPage.tsx`)
- **Direct fetch**: Replaced `fetchRemoteFeed()` with direct fetch call
- **No-cache enforcement**: Added cache-busting query param and `cache: 'no-store'`
- **Better logging**: Shows data source (remote/local) and count
- **Data normalization**: Uses `normalizeList()` for consistent data structure
- **Cleanup**: Added proper cleanup function to prevent memory leaks

### 4. Enhanced Admin Panel (`src/pages/OkHowAdminPage.tsx`)
- **Status indicator**: Added visual chip showing Remote Mode status (ACTIVE/DISABLED)
- **Warning banner**: Shows alert when remote mode is disabled
- **Direct link**: Added "View feed" link to verify saved videos
- **No-cache refetch**: Feed is refetched with no-store after successful save
- **Better messaging**: Toggle now explains what happens to the public page
- **Data normalization**: Uses `normalizeList()` for consistent display

### 5. Environment Configuration
- **Updated `.env`**: Added `VITE_REMOTE_ENABLED=false` as default
- **Updated `.env.example`**: Documented the new environment variable

### 6. Verified Components
- **VideoCard.tsx**: Confirmed uses `video.id` (not `vimeoId`)
- **VideoGrid.tsx**: Confirmed uses `video.id` for keys and props
- **VideoLightbox.tsx**: Confirmed uses `video.id` for rendering
- **okhowto-feed.ts**: Confirmed has `Cache-Control: no-store` header

## How It Works Now

### For Developers
1. Set `VITE_REMOTE_ENABLED=true` in `.env` to enable remote mode by default
2. Or leave it `false` and use the admin toggle for testing

### For Admin Users
1. Go to `/ok-how-admin-7x9k2mq8p`
2. See the status indicator at the top (ACTIVE or DISABLED)
3. If DISABLED, you'll see a warning that videos won't appear on public page
4. Toggle "Use remote feed on /ok-how-to page" to enable
5. The preference is saved to localStorage and persists

### For End Users
- `/ok-how-to` automatically loads from remote feed when enabled
- Falls back to local data if remote feed fails or is empty
- No user-facing errors, seamless experience

## Testing Checklist

- [x] Build succeeds without errors
- [x] Remote mode toggle persists across page reloads
- [x] Admin panel shows correct status indicator
- [x] Warning appears when remote mode is disabled
- [x] Feed link opens correctly
- [x] Video IDs are normalized consistently
- [x] No-cache headers prevent stale data
- [x] VITE_REMOTE_ENABLED environment variable works

## Migration Notes

### Immediate Actions
1. Admin users should visit the admin panel and enable the toggle
2. Or set `VITE_REMOTE_ENABLED=true` in Netlify environment variables

### Breaking Changes
None - all changes are backward compatible

### Rollback Plan
If issues arise, set `VITE_REMOTE_ENABLED=false` or use the admin toggle to disable

## Files Modified
- `src/config/okhowto.runtime.ts` (replaced)
- `src/pages/OkHowToPage.tsx` (refactored)
- `src/pages/OkHowAdminPage.tsx` (enhanced)
- `.env` (added VITE_REMOTE_ENABLED)
- `.env.example` (documented VITE_REMOTE_ENABLED)

## Files Created
- `src/utils/okhowto/normalize.ts` (new)

## Next Steps
1. Deploy to Netlify
2. Visit admin panel and enable Remote Mode toggle
3. Save a test video
4. Verify it appears on `/ok-how-to` page
5. Check browser console for confirmation logs
