# Favicon and Social Media Setup Guide

This document explains how to complete the favicon and social media preview configuration for On Klinic.

## Required Source Images

You need to provide two source images in the `/public/` directory:

### 1. OK_Favicon.PNG
- **Location:** `/public/OK_Favicon.PNG`
- **Purpose:** Source image for generating all favicon sizes
- **Requirements:**
  - Format: PNG with transparency
  - Recommended size: 512x512px (minimum 256x256px)
  - Must be square (1:1 aspect ratio)
  - Should work well at small sizes (16x16px)
  - Clear, simple design that's recognizable when scaled down

### 2. Preview_OK.gif
- **Location:** `/public/Preview_OK.gif`
- **Purpose:** Animated preview for social media sharing (Facebook, LinkedIn, Twitter, WhatsApp)
- **Requirements:**
  - Format: Animated GIF
  - Recommended size: 1200x630px (Facebook/LinkedIn standard)
  - Alternative size: 1200x627px (Twitter standard)
  - File size: Under 5MB for compatibility with all platforms
  - Should be engaging and represent On Klinic's brand
  - Must be legible in small thumbnail previews

## Favicon Sizes to Generate

Once you have `OK_Favicon.PNG`, generate these sizes:

1. **favicon.ico** - 16x16px and 32x32px combined ICO file
2. **favicon-16x16.png** - 16x16px
3. **favicon-32x32.png** - 32x32px
4. **favicon-192x192.png** - 192x192px (Android)
5. **favicon-512x512.png** - 512x512px (Android)
6. **apple-touch-icon.png** - 180x180px (iOS)

### Tools for Generating Favicons

#### Option 1: Online Tools
- [Favicon.io](https://favicon.io/) - Upload PNG and download all sizes
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive favicon generator

#### Option 2: Command Line (ImageMagick)
```bash
# Install ImageMagick if not already installed
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Navigate to your project's public directory
cd /path/to/project/public

# Generate all sizes from OK_Favicon.PNG
convert OK_Favicon.PNG -resize 16x16 favicon-16x16.png
convert OK_Favicon.PNG -resize 32x32 favicon-32x32.png
convert OK_Favicon.PNG -resize 192x192 favicon-192x192.png
convert OK_Favicon.PNG -resize 512x512 favicon-512x512.png
convert OK_Favicon.PNG -resize 180x180 apple-touch-icon.png

# Generate favicon.ico (combined 16x16 and 32x32)
convert OK_Favicon.PNG -resize 16x16 -define icon:auto-resize=16,32 favicon.ico
```

#### Option 3: Photoshop/GIMP
1. Open OK_Favicon.PNG
2. Use "Export As" or "Save for Web"
3. Resize to each required dimension
4. Export as PNG with transparency

## File Checklist

Place these files in `/public/`:

- [ ] OK_Favicon.PNG (source file)
- [ ] Preview_OK.gif (source file)
- [ ] favicon.ico (generated)
- [ ] favicon-16x16.png (generated)
- [ ] favicon-32x32.png (generated)
- [ ] favicon-192x192.png (generated)
- [ ] favicon-512x512.png (generated)
- [ ] apple-touch-icon.png (generated)

## Configuration Status

The following files have already been configured:

✅ `index.html` - Updated with all meta tags and favicon links
✅ `public/manifest.json` - Created for PWA support

## Testing and Validation

After adding all image files, test the implementation:

### Browser Favicon Testing

1. **Chrome/Edge**
   - Clear browser cache
   - Visit http://localhost:5173
   - Check favicon in browser tab
   - Check in bookmarks
   - Test light and dark mode

2. **Firefox**
   - Clear cache
   - Visit site
   - Check tab icon
   - Check in bookmarks

3. **Safari**
   - Clear cache
   - Visit site
   - Check tab icon
   - Check in Reading List

### Mobile Testing

4. **iOS (Safari)**
   - Visit site on iPhone/iPad
   - Tap "Share" → "Add to Home Screen"
   - Verify apple-touch-icon appears correctly
   - Launch app from home screen

5. **Android (Chrome)**
   - Visit site on Android device
   - Tap menu → "Add to Home screen"
   - Verify 192x192 or 512x512 icon appears
   - Launch PWA from home screen

### Social Media Preview Testing

6. **Facebook Sharing Debugger**
   - Visit: https://developers.facebook.com/tools/debug/
   - Enter: https://onklinic.com
   - Click "Scrape Again" to refresh
   - Verify Preview_OK.gif appears and animates
   - Check title and description

7. **Twitter Card Validator**
   - Visit: https://cards-dev.twitter.com/validator
   - Enter: https://onklinic.com
   - Verify large image card appears
   - Check GIF animation
   - Verify title and description

8. **LinkedIn Post Inspector**
   - Visit: https://www.linkedin.com/post-inspector/
   - Enter: https://onklinic.com
   - Verify preview image and metadata
   - Test by creating a draft post

9. **WhatsApp Preview**
   - Send https://onklinic.com in a WhatsApp message
   - Verify preview appears with image
   - Check on both mobile and desktop

### Additional Checks

10. **PWA Installation**
    - Visit site in Chrome/Edge
    - Look for "Install" button in address bar
    - Install the app
    - Verify icon in app drawer
    - Test offline functionality (if applicable)

## Image Dimensions Verification

Once you add Preview_OK.gif, verify its dimensions and update index.html if needed:

```bash
# Check GIF dimensions
file Preview_OK.gif
# or
identify Preview_OK.gif
```

If dimensions are different from 1200x630:
1. Update line 32 in `index.html`: `<meta property="og:image:width" content="[actual_width]" />`
2. Update line 33 in `index.html`: `<meta property="og:image:height" content="[actual_height]" />`

## Troubleshooting

### Favicons not updating
- Clear browser cache completely
- Try incognito/private window
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Social media preview not showing
- Use the debugging tools to force a refresh
- Ensure image URLs are absolute (https://onklinic.com/...)
- Check that images are publicly accessible
- Verify image file sizes are under limits

### GIF not animating in previews
- Some platforms only show first frame in certain contexts
- Ensure GIF file size is under 5MB
- Test on multiple platforms as behavior varies

## Notes

- All meta tags are already configured in `index.html`
- The theme color is set to `#10b981` (green, suitable for mental health branding)
- Canonical URL is set to `https://onklinic.com`
- All social media platforms will use Preview_OK.gif for sharing
- PWA is configured to use the On Klinic brand colors

## Build and Deploy

After adding all images:

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview

# Deploy to production
# (Follow your normal deployment process)
```
