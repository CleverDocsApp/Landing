# OK How To Admin Setup Guide

This guide will help you set up and use the private admin panel for managing OK How To videos.

## Table of Contents

1. [Cloudinary Configuration](#cloudinary-configuration)
2. [Netlify Environment Variables](#netlify-environment-variables)
3. [Activation Procedure](#activation-procedure)
4. [Using the Admin Panel](#using-the-admin-panel)
5. [Security & Rate Limiting](#security--rate-limiting)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedure](#rollback-procedure)

---

## Cloudinary Configuration

### Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Upload Preset

1. Log in to your Cloudinary Dashboard
2. Navigate to **Settings** > **Upload**
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**

#### Preset Configuration:

- **Preset name**: `okhowto-unsigned`
- **Signing Mode**: **Unsigned** (CRITICAL: Must be unsigned)
- **Folder**: `okhowto-thumbs` (fixed, not user-modifiable)
- **Allowed formats**: `jpg,png,webp`
- **Max file size**: `300000` bytes (300KB)
- **Transformation**: Leave empty (no automatic transformations)
- **Overwrite**: `false`
- **Unique filename**: `true`

5. Click **Save**

### Step 3: Get Your Credentials

1. Go to **Dashboard** (home page)
2. Find your **Cloud name** (e.g., `dxyz1234abc`)
3. Note down the upload preset name: `okhowto-unsigned`

---

## Netlify Environment Variables

### Configure in Netlify Dashboard

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:

| Variable Name | Value | Scope |
|---------------|-------|-------|
| `OKH_PASS` | Your secure passphrase (min 16 characters) | Production + Deploy Previews |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Production + Deploy Previews |
| `CLOUDINARY_UPLOAD_PRESET` | `okhowto-unsigned` | Production + Deploy Previews |
| `CLOUDINARY_FOLDER` | `okhowto-thumbs` | Production + Deploy Previews |
| `BLOBS_NAMESPACE` | `okhowto` | Production + Deploy Previews |

**IMPORTANT**: Make sure all variables are set for both **Production** and **Deploy Previews**.

---

## Activation Procedure

### Phase 1: Initial Deploy with Validation (REMOTE_ENABLED = false)

1. **Deploy the PR to a Deploy Preview**
   - Netlify will automatically create a preview URL
   - At this stage, `REMOTE_ENABLED = false` in code

2. **Access the Admin Panel**
   - Navigate to: `https://[your-preview].netlify.app/ok-how-admin-7x9k2mq8p`
   - This URL is secret and should NOT be shared

3. **Test Upload Functionality**
   - Enter your passphrase (from `OKH_PASS` env var)
   - Select a test thumbnail (JPG, PNG, or WebP, under 300KB)
   - Click "Upload Thumbnail"
   - Verify successful upload and Cloudinary URL is returned

4. **Test Save Functionality**
   - Fill in all required fields:
     - Vimeo ID (e.g., `123456789`)
     - Title
     - Description
     - Category
     - Thumbnail URL (from previous upload)
   - Click "Save Video"
   - Verify success message appears

5. **Test Feed Endpoint**
   - Click "Refresh Feed" button
   - Verify your saved video appears in the list
   - Check that all details are correct

6. **Verify /ok-how-to Still Uses Local Data**
   - Navigate to: `https://[your-preview].netlify.app/ok-how-to`
   - Should still show placeholder videos from `src/data/okhowto.json`
   - This confirms remote mode is OFF

### Phase 2: Enable Remote Mode (REMOTE_ENABLED = true)

1. **Update Code**
   - Change `REMOTE_ENABLED = false` to `REMOTE_ENABLED = true` in `src/config/okhowto.runtime.ts`
   - Commit and push

2. **Deploy to Production**
   - Merge the PR or push to main branch
   - Wait for Netlify to deploy

3. **Validate Production**
   - Navigate to: `https://[your-domain]/ok-how-to`
   - Should now show videos from remote feed (if any saved)
   - Console should log: `[OK How To] Loaded videos from remote feed`

4. **Test Fallback**
   - If remote feed is empty or fails, it will automatically fall back to local JSON
   - No user-facing errors should appear

### Phase 3: Monitor

- Check Netlify Functions logs for first 24 hours
- Verify no unusual errors
- Confirm cache headers are working (`Cache-Control: public, max-age=60`)
- Monitor rate limiting is working as expected

---

## Using the Admin Panel

### Accessing the Panel

- URL: `https://[your-domain]/ok-how-admin-7x9k2mq8p`
- **IMPORTANT**: Do NOT link this URL anywhere on your site
- The page has `<meta name="robots" content="noindex,nofollow">` to prevent indexing

### Adding a Video

1. **Enter Passphrase**
   - Type your passphrase (from `OKH_PASS` env var)
   - This is required for every upload/save action
   - Not stored in browser (for security)

2. **Fill Video Details**
   - **Vimeo ID** (required): The Vimeo video ID (e.g., `987654321`)
   - **Category** (required): Select from dropdown
     - Getting Started
     - Features
     - Best Practices
   - **Title** (required): Video title
   - **Description** (required): Brief description
   - **Duration** (optional): Length in seconds
   - **Caption Languages** (optional): Comma-separated (e.g., `en, es, fr`)
   - **Default Caption** (optional): Language code (e.g., `en`)

3. **Upload Thumbnail**
   - Click the upload area or drag-and-drop
   - File must be:
     - JPG, PNG, or WebP format
     - Under 300KB
   - Click "Upload Thumbnail" button
   - Wait for Cloudinary URL to appear

4. **Save Video**
   - Click "Save Video" button
   - Success message will appear
   - Video will appear in "Recent Videos" section
   - Form will reset for next entry

### Editing a Video

- Use the same Vimeo ID as an existing video
- Fill in the form with updated details
- Upload new thumbnail if needed
- Click "Save Video"
- The system will update (upsert) the existing record

### Remote Mode Toggle

- At the bottom of the form, there's a toggle switch
- **OFF**: /ok-how-to page uses local JSON data
- **ON**: /ok-how-to page uses remote feed from Netlify Blobs
- This is for testing/debugging purposes

### Recent Videos Feed

- Shows last 20 videos from Netlify Blobs
- Click "Refresh Feed" to reload
- Displays:
  - Thumbnail preview
  - Title, description
  - Vimeo ID, category
  - Duration (if set)
  - Last updated date

---

## Security & Rate Limiting

### CORS Protection

- Functions only accept requests from:
  - Your production domain
  - `*.netlify.app` domains (for previews)
- All other origins are rejected with 403 Forbidden

### Passphrase Authentication

- Passphrase is sent in `X-OK-PASS` header with every request
- Never stored in browser localStorage or sessionStorage
- Must be entered for each upload/save action
- Returns 401 Unauthorized if incorrect

### Rate Limiting

- **Limit**: 10 requests per minute per IP address
- Applies to all three functions: upload, save, feed
- Exceeded limit returns: 429 Too Many Requests
- Resets after 1 minute

### File Upload Restrictions

**Client-side validation**:
- File type: JPG, PNG, WebP only
- File size: Maximum 300KB
- Error shown before upload attempt

**Server-side validation** (in function):
- MIME type check: `image/jpeg`, `image/png`, `image/webp`
- File size check: Maximum 300,000 bytes
- Returns 400 Bad Request if invalid
- Returns 413 Payload Too Large if over limit

**Cloudinary preset restrictions**:
- Unsigned upload (no signature required)
- Fixed folder: `okhowto-thumbs`
- Allowed formats: `jpg,png,webp`
- Max file size: 300KB
- No transformations applied

---

## Troubleshooting

### "Upload failed with status 401"

**Cause**: Incorrect passphrase

**Solution**:
- Double-check your passphrase matches `OKH_PASS` env var in Netlify
- Case-sensitive match required
- No extra spaces

---

### "Upload failed with status 403"

**Cause**: CORS rejection (invalid origin)

**Solution**:
- Verify you're accessing from your production domain or `*.netlify.app`
- Check browser console for CORS errors
- Update `netlify/functions/utils/cors.ts` if your domain changed

---

### "Upload failed with status 413"

**Cause**: File too large

**Solution**:
- Reduce file size to under 300KB
- Use image compression tools
- Try WebP format for better compression

---

### "Failed to upload to Cloudinary"

**Cause**: Cloudinary configuration issue

**Solution**:
- Verify `CLOUDINARY_CLOUD_NAME` is correct
- Verify `CLOUDINARY_UPLOAD_PRESET` exists and is "unsigned"
- Check preset allows jpg/png/webp formats
- Verify preset max size is at least 300KB

---

### "Rate limit exceeded"

**Cause**: Too many requests in 1 minute

**Solution**:
- Wait 1 minute and try again
- Rate limit resets automatically
- Limit is 10 requests per minute per IP

---

### Remote feed returns empty array

**Cause**: No videos saved yet, or Netlify Blobs not configured

**Solution**:
- Save at least one video using the admin panel
- Verify `BLOBS_NAMESPACE` env var is set
- Check Netlify Blobs is enabled for your site

---

### /ok-how-to page still shows placeholder videos

**Cause**: `REMOTE_ENABLED = false` or remote feed failed

**Solution**:
- Check `src/config/okhowto.runtime.ts` has `REMOTE_ENABLED = true`
- Check browser console for fallback messages
- Verify at least one video is saved in Blobs
- Try accessing feed directly: `https://[your-domain]/.netlify/functions/okhowto-feed`

---

## Rollback Procedure

### Immediate Rollback (No Code Deploy)

If something goes wrong and you need to immediately revert to local JSON data:

1. **Access Admin Panel**
   - Navigate to: `https://[your-domain]/ok-how-admin-7x9k2mq8p`

2. **Toggle Remote Mode OFF**
   - At the bottom of the page, click the toggle switch
   - Turns from green (ON) to gray (OFF)

3. **Effect**
   - /ok-how-to page will immediately use local JSON data
   - No deploy required
   - Takes effect on next page load

**OR** (if admin panel is inaccessible):

1. **Edit Runtime Config**
   - Open `src/config/okhowto.runtime.ts` in your code
   - Change `export const REMOTE_ENABLED = true;` to `export const REMOTE_ENABLED = false;`

2. **Deploy**
   - Commit and push
   - Netlify auto-deploys in ~2 minutes

3. **Result**
   - Site reverts to using local JSON data
   - No data loss (Blobs data preserved)

---

### Full Rollback (Remove Feature)

If you need to completely remove the admin panel:

1. **Revert Git Commit**
   ```bash
   git revert [commit-hash]
   git push
   ```

2. **Remove Environment Variables** (optional)
   - Go to Netlify Dashboard > Site settings > Environment variables
   - Delete: `OKH_PASS`, `CLOUDINARY_*`, `BLOBS_NAMESPACE`

3. **Disable Functions** (optional)
   - Netlify Dashboard > Functions
   - Delete or disable: `okhowto-upload`, `okhowto-save`, `okhowto-feed`

---

### Data Rollback

If Blobs data gets corrupted:

1. **Access Netlify Blobs**
   - Netlify Dashboard > Blobs
   - Select namespace: `okhowto`

2. **View/Edit videos.json**
   - View the JSON file
   - Edit manually if needed
   - Or delete and let system recreate

3. **Restore from Backup**
   - If you have a backup of `videos.json`, paste contents
   - Or delete blob and recreate videos via admin panel

4. **Fallback to Local**
   - Set `REMOTE_ENABLED = false`
   - Site uses local JSON until Blobs is fixed

---

## Best Practices

### Video Management

- Use descriptive, SEO-friendly titles
- Keep descriptions concise (2-3 sentences)
- Always include duration for better UX
- Use consistent thumbnail aspect ratios
- Optimize thumbnails before upload (compression tools)

### Security

- Never share the admin URL publicly
- Change `OKH_PASS` periodically
- Use a strong passphrase (16+ characters)
- Monitor Netlify Functions logs for suspicious activity

### Performance

- Remote feed is cached for 60 seconds (CDN)
- Thumbnail CDN is Cloudinary (fast globally)
- Fallback to local JSON ensures no downtime

### Monitoring

- Check Functions logs weekly
- Verify Cloudinary usage stays within free tier
- Monitor Netlify Blobs storage usage

---

## Support

For issues not covered in this guide:

1. Check Netlify Functions logs for errors
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Test in Deploy Preview before production

---

## Checklist for Initial Setup

- [ ] Cloudinary account created
- [ ] Upload preset `okhowto-unsigned` configured
- [ ] All environment variables set in Netlify
- [ ] Deploy Preview tested
- [ ] Upload functionality tested
- [ ] Save functionality tested
- [ ] Feed endpoint tested
- [ ] CORS working (no 403 errors)
- [ ] Rate limiting working (tested 11 requests)
- [ ] Admin page not indexed (verified in robots.txt or meta tags)
- [ ] `REMOTE_ENABLED = false` for initial PR
- [ ] /ok-how-to still uses local data
- [ ] After validation, `REMOTE_ENABLED = true`
- [ ] /ok-how-to loads remote data
- [ ] Fallback tested (works when feed fails)

---

## Technical Details

### Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       v                  v
┌──────────────┐   ┌─────────────┐
│  Admin Page  │   │ /ok-how-to  │
│ (private)    │   │  (public)   │
└──────┬───────┘   └──────┬──────┘
       │                  │
       v                  v
┌─────────────────────────────────┐
│    Netlify Functions            │
│  - okhowto-upload (POST)        │
│  - okhowto-save (POST)          │
│  - okhowto-feed (GET)           │
└────────┬─────────────┬──────────┘
         │             │
         v             v
┌──────────────┐  ┌──────────────┐
│  Cloudinary  │  │ Netlify Blobs│
│  (thumbnails)│  │ (videos.json)│
└──────────────┘  └──────────────┘
```

### Data Flow

1. **Upload Thumbnail**: Admin → upload function → Cloudinary → returns URL
2. **Save Video**: Admin → save function → Netlify Blobs → upsert video
3. **Load Videos**: /ok-how-to → feed function → Netlify Blobs → return array
4. **Fallback**: Feed fails/empty → load local JSON

---

*Last updated: 2025*
