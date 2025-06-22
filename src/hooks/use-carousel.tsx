
import { useState, useEffect } from "react";

export function useCarousel(options?: {
  autoplayInterval?: number;
  pauseOnHover?: boolean;
}) {
  const {
    autoplayInterval = 5000,
    pauseOnHover = true,
  } = options || {};

  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Set up event listeners and autoplay
  useEffect(() => {
    if (!api) return;
    
    // Update current index when slide changes
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    
    // Initialize with the current slide
    setCurrentIndex(api.selectedScrollSnap());
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);
  
  // Handle autoplay
  useEffect(() => {
    if (!api || !isPlaying) return;
    
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to the first slide
      }
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [api, isPlaying, autoplayInterval]);
  
  // Pause and resume functions for hover behavior
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  
  return {
    api,
    setApi,
    currentIndex,
    isPlaying,
    pause: pauseOnHover ? pause : undefined,
    resume: pauseOnHover ? resume : undefined,
    scrollTo: (index: number) => api?.scrollTo(index),
  };
}
