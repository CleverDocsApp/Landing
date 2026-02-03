# Under Construction Banner - Quick Guide

## Overview

A professional "Early Access - Site Under Construction" banner has been added to all pages of your site. The banner informs visitors that the platform is actively being developed.

## Features

- **Visible on all pages**: Landing page, OK How-To page, and Admin page
- **Dismissible**: Visitors can close the banner by clicking the X button
- **Smart persistence**: Once dismissed, the banner stays hidden for 24 hours
- **Responsive design**: Looks great on mobile, tablet, and desktop
- **Professional styling**: Amber/yellow gradient matching warning/construction themes

## How to Remove the Banner

When your site is ready for production, you have two simple options:

### Option 1: Quick Toggle (Recommended)

1. Open the file: `src/config/features.ts`
2. Change `SHOW_CONSTRUCTION_BANNER: true` to `SHOW_CONSTRUCTION_BANNER: false`
3. Save the file
4. The banner will disappear from all pages

### Option 2: Complete Removal

If you want to completely remove the banner code:

1. Delete the folder: `src/components/UnderConstruction/`
2. Open `src/App.tsx` and remove these lines:
   - Import: `import UnderConstructionBanner from './components/UnderConstruction/UnderConstructionBanner';`
   - Import: `import { FEATURE_FLAGS } from './config/features';`
   - All instances of: `{FEATURE_FLAGS.SHOW_CONSTRUCTION_BANNER && <UnderConstructionBanner />}`
3. Optionally delete: `src/config/features.ts`

## Customization

### Change the Message

Edit `src/components/UnderConstruction/UnderConstructionBanner.tsx`:

- Line ~50: Main title text
- Line ~53: Subtitle text

### Change Colors

Edit `src/components/UnderConstruction/UnderConstructionBanner.css`:

- `.under-construction-banner`: Main background gradient and border
- Various color values throughout the file

### Change Dismiss Duration

Edit `src/components/UnderConstruction/UnderConstructionBanner.tsx`:

- Line 7: `DISMISS_DURATION` (currently 24 hours in milliseconds)

## Files Created

- `src/config/features.ts` - Feature flags configuration
- `src/components/UnderConstruction/UnderConstructionBanner.tsx` - Banner component
- `src/components/UnderConstruction/UnderConstructionBanner.css` - Banner styles
- `src/App.tsx` - Modified to include the banner (3 locations)

## Testing

The banner will appear at the very top of every page. Users can:
- See the banner on first visit
- Dismiss it by clicking the X button
- Not see it again for 24 hours after dismissing
- See it again after 24 hours if still enabled

---

**Ready to launch? Just set `SHOW_CONSTRUCTION_BANNER: false` in `src/config/features.ts`**
