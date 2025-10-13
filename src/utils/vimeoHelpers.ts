export const getVimeoEmbedUrl = (videoId: string | number, privacyHash?: string): string => {
  const baseUrl = `https://player.vimeo.com/video/${videoId}`;
  const params = new URLSearchParams({
    dnt: '1',
    title: '0',
    byline: '0',
    portrait: '0'
  });

  if (privacyHash) {
    params.set('h', privacyHash);
  }

  return `${baseUrl}?${params.toString()}`;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isPlaceholderId = (videoId: string | number): boolean => {
  return typeof videoId === 'string' && videoId.startsWith('PLACEHOLDER_');
};
