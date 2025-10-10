export const REMOTE_ENABLED = false;

export const FEED_URL = '/.netlify/functions/okhowto-feed';
export const UPLOAD_URL = '/.netlify/functions/okhowto-upload';
export const SAVE_URL = '/.netlify/functions/okhowto-save';

let currentRemoteMode = REMOTE_ENABLED;

export const isRemoteModeEnabled = (): boolean => {
  return currentRemoteMode;
};

export const toggleRemoteMode = (enabled: boolean): void => {
  currentRemoteMode = enabled;
};
