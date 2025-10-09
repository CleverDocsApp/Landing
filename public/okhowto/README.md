# OK How To - Content Management Guide

## Overview

This directory contains thumbnails and documentation for the OK How To video library. Videos are embedded from Vimeo using their video IDs.

## Adding New Videos

To add a new video to the OK How To page:

### 1. Add Video Entry to JSON

Edit `src/data/okhowto.json` and add a new video object:

```json
{
  "id": 987654321,
  "title": "Your Video Title",
  "description": "Brief description of what the video covers (max 150 characters)",
  "category": "features",
  "thumb": "/okhowto/thumbs/your-video-name.webp",
  "duration": 240
}
```

**Fields:**
- `id` (number): Vimeo video ID (found in video URL: vimeo.com/[ID])
- `title` (string): Video title, max 60 characters
- `description` (string): Video description, max 150 characters
- `category` (string): Must match a category slug (features, best-practices, onboarding)
- `thumb` (string): Path to thumbnail image in `/okhowto/thumbs/`
- `duration` (number, optional): Video duration in seconds

### 2. Add Thumbnail Image

Upload your thumbnail to `public/okhowto/thumbs/` following these specifications:

**Thumbnail Specifications:**
- **Aspect Ratio:** 16:9 (mandatory)
- **Recommended Size:** 1280×720px
- **Maximum File Size:** 200KB
- **Format:** WebP (preferred), JPG or PNG acceptable
- **Naming:** Use kebab-case (lowercase with hyphens)
  - ✅ Good: `treatment-plan-validator.webp`
  - ❌ Bad: `Treatment Plan Validator.jpg`

**Optimization Tips:**
- Use online tools like [Squoosh](https://squoosh.app/) to compress images
- Convert to WebP format for better compression
- Ensure images are sharp and representative of video content
- Avoid text-heavy thumbnails (they may be hard to read on mobile)

### 3. Create Pull Request

1. Commit both files (JSON + thumbnail)
2. Create a pull request to the `feature/ok-how-to` branch
3. Request review and test in Deploy Preview
4. Verify video plays correctly and thumbnail displays properly

### 4. Validation Checklist

Before submitting your PR, verify:

- [ ] Vimeo ID is correct and video is publicly accessible
- [ ] Thumbnail is exactly 16:9 aspect ratio
- [ ] Thumbnail file size is under 200KB
- [ ] Filename is in kebab-case with no spaces
- [ ] JSON syntax is valid (use a JSON validator)
- [ ] Title is under 60 characters
- [ ] Description is under 150 characters
- [ ] Category slug matches existing categories

## Current Categories

- `features` - Features and capabilities
- `best-practices` - Clinical best practices
- `onboarding` - Getting started and onboarding

## Placeholder Content

**Note:** Initial implementation uses placeholder video IDs and generic thumbnails for QA purposes. These should be replaced with real content via PR.

- Placeholder IDs are strings like `"PLACEHOLDER_001"`
- Replace with actual numeric Vimeo IDs
- Replace placeholder thumbnails with real video screenshots

## Fallback Handling

The page automatically handles:
- Missing thumbnails (shows placeholder with "Image not available")
- Invalid Vimeo IDs (shows error message in card)
- Empty search results (shows friendly message)

## Technical Notes

- Thumbnails use lazy loading (`loading="lazy"`) for performance
- Videos are embedded inline (no modal popup)
- User must initiate playback (no autoplay)
- Only one video can be expanded at a time
- Privacy mode enabled (dnt=1, no Vimeo branding)

## Need Help?

Contact the development team for assistance with:
- JSON structure questions
- Image optimization
- Category additions
- Technical issues

---

Last Updated: 2025-10-09
