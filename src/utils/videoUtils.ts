
export interface VideoInfo {
  type: 'direct' | 'youtube' | 'vimeo';
  embedUrl: string;
  originalUrl: string;
}

export function getVideoInfo(url: string): VideoInfo {
  const trimmedUrl = url.trim();
  
  // YouTube detection and conversion
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = trimmedUrl.match(youtubeRegex);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      originalUrl: trimmedUrl
    };
  }
  
  // Vimeo detection and conversion
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const vimeoMatch = trimmedUrl.match(vimeoRegex);
  
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      originalUrl: trimmedUrl
    };
  }
  
  // Direct video file (mp4, webm, etc.)
  return {
    type: 'direct',
    embedUrl: trimmedUrl,
    originalUrl: trimmedUrl
  };
}

export function isVideoUrl(url: string): boolean {
  const videoInfo = getVideoInfo(url);
  // Check if it's a video platform URL or has video file extension
  return videoInfo.type !== 'direct' || /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(url);
}
