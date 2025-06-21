import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Upload, X, Image, Plus } from "lucide-react";

interface MultipleImageUploadProps {
  label: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  label,
  images,
  onImagesChange,
  maxImages = 6,
  maxSize = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images total.`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (const file of files) {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`File ${file.name} is too large. Must be less than ${maxSize}MB.`);
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not an image.`);
          continue;
        }

        // Convert to base64
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(dataUrl);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } catch (err) {
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
        <p className="text-sm text-gray-600">
          Upload up to {maxImages} images ({maxSize}MB each)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Additional photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Image className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Add More Photos</p>
                <p className="text-xs text-gray-500">
                  {images.length} of {maxImages} images uploaded
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="mt-2"
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Choose Files"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}; 