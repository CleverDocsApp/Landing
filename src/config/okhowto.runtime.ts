const STORAGE_KEY = 'OKH_REMOTE_ENABLED';

const envDefault =
  (import.meta as any).env?.VITE_REMOTE_ENABLED
    ? String((import.meta as any).env.VITE_REMOTE_ENABLED).toLowerCase() === 'true'
    : false;

let currentRemoteMode = (() => {
  try {
    if (typeof window === 'undefined') return envDefault;
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (s === 'true' || s === 'false') return s === 'true';
  } catch {}
  return envDefault;
})();

export const FEED_URL = '/.netlify/functions/okhowto-feed';
export const UPLOAD_URL = '/.netlify/functions/okhowto-upload';
export const SAVE_URL = '/.netlify/functions/okhowto-save';
export const DIAGNOSTICS_URL = '/.netlify/functions/okhowto-diagnostics';

export const isRemoteModeEnabled = (): boolean => currentRemoteMode;

export const setRemoteMode = (enabled: boolean): void => {
  currentRemoteMode = enabled;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  } catch {}
};

export const toggleRemoteMode = setRemoteMode;
