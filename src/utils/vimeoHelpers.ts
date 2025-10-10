export const getVimeoEmbedUrl = (videoId: string | number): string => {
  return `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0`;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isPlaceholderId = (videoId: string | number): boolean => {
  return typeof videoId === 'string' && videoId.startsWith('PLACEHOLDER_');
};
