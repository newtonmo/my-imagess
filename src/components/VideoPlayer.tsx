
import React, { useRef, useEffect, useState } from 'react';
import { getVideoInfo } from '@/utils/videoUtils';

interface VideoPlayerProps {
  src: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  loopCount?: number; // New prop for specific loop count
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className = '',
  controls = true,
  autoPlay = false,
  loop = false,
  loopCount,
  muted = false,
  playsInline = true,
  poster
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLoopCount, setCurrentLoopCount] = useState(0);
  const videoInfo = getVideoInfo(src);

  useEffect(() => {
    if (videoRef.current && !muted) {
      // Set volume to 50% by default when not muted
      videoRef.current.volume = 0.5;
    }
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loopCount) return;

    const handleEnded = () => {
      setCurrentLoopCount(prev => {
        const newCount = prev + 1;
        if (newCount < loopCount) {
          video.currentTime = 0;
          video.play();
        }
        return newCount;
      });
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [loopCount]);

  // Reset loop count when video starts playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setCurrentLoopCount(0);
    };

    video.addEventListener('play', handlePlay);
    return () => video.removeEventListener('play', handlePlay);
  }, []);

  if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
    // For embedded videos, we can't control loop count, so fall back to regular loop
    const embedUrl = loopCount ? `${videoInfo.embedUrl}&loop=1` : videoInfo.embedUrl;

    return (
      <iframe
        src={embedUrl}
        className={`w-full h-full border-0 ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      />
    );
  }

  // Direct video file
  return (
    <video
      ref={videoRef}
      src={videoInfo.embedUrl}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={!loopCount && loop} // Only use native loop if loopCount is not specified
      muted={muted}
      playsInline={playsInline}
      poster={poster}
    />
  );
};

export default VideoPlayer;
