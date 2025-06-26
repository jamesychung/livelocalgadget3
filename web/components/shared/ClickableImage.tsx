import React, { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  images?: string[]; // Array of all images for lightbox navigation
  index?: number; // Index of this image in the images array
}

export const ClickableImage: React.FC<ClickableImageProps> = ({
  src,
  alt,
  className = "",
  images = [],
  index = 0,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // If no images array provided, use just this image
  const allImages = images.length > 0 ? images : [src];
  const imageIndex = images.length > 0 ? index : 0;

  const handleImageClick = () => {
    setIsLightboxOpen(true);
  };

  const handleClose = () => {
    setIsLightboxOpen(false);
  };

  const handleNavigate = (newIndex: number) => {
    // This will be handled by the parent component if needed
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={handleImageClick}
      />
      
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={handleClose}
        images={allImages}
        currentIndex={imageIndex}
        onNavigate={handleNavigate}
      />
    </>
  );
}; 