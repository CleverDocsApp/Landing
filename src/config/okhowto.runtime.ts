const STORAGE_KEY = 'OKH_REMOTE_ENABLED';
const BROADCAST_CHANNEL_NAME = 'okhowto-remote-mode';

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

let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }
}

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

      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'REMOTE_MODE_CHANGED',
          enabled
        });
      }
    }
  } catch {}
};

export const onRemoteModeChange = (callback: (enabled: boolean) => void): (() => void) => {
  if (!broadcastChannel) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'REMOTE_MODE_CHANGED') {
      currentRemoteMode = event.data.enabled;
      callback(event.data.enabled);
    }
  };

  broadcastChannel.addEventListener('message', handler);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handler);
    }
  };
};

export const toggleRemoteMode = setRemoteMode;
