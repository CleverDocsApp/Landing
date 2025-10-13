# Quick Start Guide - Fixing Admin Panel Errors

If you're seeing "500 Internal Server Error" when trying to upload videos through the admin panel, it's likely due to missing environment variables in Netlify.

## Required Netlify Environment Variables

You need to configure these environment variables in your Netlify dashboard:

1. **Go to Netlify Dashboard**
   - Navigate to: Site settings > Environment variables
   - Click "Add a variable"

2. **Add These Variables**

   | Variable Name | Description | Example Value |
   |---------------|-------------|---------------|
   | `OKH_PASS` | Admin passphrase (min 16 characters) | `your-secure-passphrase-here` |
   | `BLOBS_NAMESPACE` | Netlify Blobs storage namespace | `okhowto` |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `dxyz1234abc` |
   | `CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset (must be unsigned) | `okhowto-uploads` |
   | `CLOUDINARY_FOLDER` | Cloudinary folder for thumbnails | `okhowto-thumbs` |

3. **Set Variable Scope**
   - Make sure to set each variable for both:
     - ✅ Production
     - ✅ Deploy previews

## Cloudinary Setup

If you haven't set up Cloudinary yet:

1. **Create Account**: [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. **Create Upload Preset**:
   - Go to Settings > Upload
   - Add upload preset
   - **IMPORTANT**: Set "Signing Mode" to "Unsigned"
   - Set folder name (e.g., `okhowto-thumbs`)
   - Allowed formats: `jpg,png,webp`
   - Max file size: `300000` bytes

3. **Get Credentials**:
   - Dashboard shows your Cloud name
   - Note your upload preset name

## Testing the Fix

After adding environment variables:

1. Trigger a new deploy (or wait for auto-deploy)
2. Access admin panel: `https://your-site.netlify.app/ok-how-admin-7x9k2mq8p`
3. Try uploading a video
4. Check Netlify Functions logs if issues persist

## Common Error Messages (Now Fixed)

✅ **"Server configuration error: Missing BLOBS_NAMESPACE"**
   - Solution: Add `BLOBS_NAMESPACE=okhowto` to Netlify env vars

✅ **"Server configuration error: Missing CLOUDINARY_CLOUD_NAME"**
   - Solution: Add all three Cloudinary variables to Netlify env vars

✅ **"Authentication failed"**
   - Solution: Check your `OKH_PASS` matches what you entered

✅ **"Access forbidden. CORS issue detected"**
   - Solution: Already fixed! Localhost and Netlify domains are now allowed

## What Was Fixed

1. ✅ CORS preflight handler now returns correct format
2. ✅ Added localhost support for local testing
3. ✅ Detailed error logging in all serverless functions
4. ✅ Better error messages showing exactly which env vars are missing
5. ✅ Improved client-side error handling with specific messages
6. ✅ Added @netlify/functions package for proper TypeScript types

## Need More Help?

- Check detailed setup guide: `ADMIN_SETUP.md`
- Review Netlify Functions logs in dashboard
- Verify all environment variables are set correctly
