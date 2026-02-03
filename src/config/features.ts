/**
 * Feature Flags Configuration
 *
 * This file contains feature flags that can be easily toggled on/off.
 * To remove a feature, simply change its value to `false`.
 */

export const FEATURE_FLAGS = {
  /**
   * Under Construction Banner
   *
   * Shows a banner at the top of all pages indicating the site is under development.
   * To remove: Set this to `false` and the banner will disappear from all pages.
   */
  SHOW_CONSTRUCTION_BANNER: true,
} as const;
