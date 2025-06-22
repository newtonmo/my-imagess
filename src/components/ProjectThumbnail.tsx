
import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import VideoPlayer from "./VideoPlayer";

interface ProjectThumbnailProps {
  image: string;
  video?: string;
  alt?: string;
}

const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ image, video, alt }) => (
  <AspectRatio ratio={16 / 9}>
    <div className="relative w-full h-full overflow-hidden group rounded-xl">
      {video ? (
        <VideoPlayer
          src={video}
          muted
          autoPlay
          loopCount={3}
          playsInline
          poster={image}
          className="w-full h-full object-cover rounded-xl border-none
            transition-transform duration-300
            group-hover:scale-105 group-hover:brightness-110
            group-focus-visible:scale-105 group-focus-visible:brightness-110
            outline-none"
        />
      ) : (
        <img
          src={image}
          alt={alt || "Project preview"}
          className="w-full h-full object-cover rounded-xl border-none
            transition-transform duration-300
            group-hover:scale-105 group-hover:brightness-110
            group-focus-visible:scale-105 group-focus-visible:brightness-110
            outline-none"
        />
      )}
      {/* Enhanced overlay for clarity */}
      <div
        className="
          pointer-events-none absolute inset-0 z-10
          bg-gradient-to-t from-black/90 via-black/50 to-transparent
          opacity-70 group-hover:opacity-80 group-focus-visible:opacity-80
          transition-opacity duration-300
        "
      />
      {/* Subtle outline for high focus */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-focus-visible:border-primary transition-colors duration-300"
      />
    </div>
  </AspectRatio>
);

export default ProjectThumbnail;
