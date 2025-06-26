import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Upload, X, Music, Image, Play, Pause } from "lucide-react";
import { ClickableImage } from "./ClickableImage";

interface FileUploadProps {
  label: string;
  type: "image" | "audio";
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  type,
  currentUrl,
  onUpload,
  onRemove,
  accept,
  maxSize = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form submission
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type - expanded to include more audio formats
    const validTypes = type === "image" 
      ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
      : ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac", "audio/webm"];
    
    if (!validTypes.includes(file.type)) {
      setError(`Please select a valid ${type} file. Got: ${file.type}`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Convert file to base64 data URL for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewUrl(dataUrl);
        
        // Pass the data URL to parent component
        onUpload(dataUrl);
        
        // Clear the file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setPreviewUrl(null);
    onRemove();
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    return type === "image" ? <Image className="h-6 w-6" /> : <Music className="h-6 w-6" />;
  };

  // Use currentUrl if available, otherwise use previewUrl
  const displayUrl = currentUrl || previewUrl;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Label className="text-sm font-medium mb-3 block">{label}</Label>
        
        {displayUrl ? (
          <div className="space-y-3">
            {type === "image" ? (
              <div className="relative inline-block">
                <ClickableImage src={displayUrl} alt="Profile" className="w-32 h-32 object-cover rounded-lg border" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={handleRemove}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleAudio}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <p className="text-sm font-medium">Audio Sample</p>
                  <p className="text-xs text-gray-500">Click to play/pause</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="h-6 w-6 p-0"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
                <audio ref={audioRef} src={displayUrl} onEnded={() => setIsPlaying(false)} />
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              {getFileIcon()}
              <div>
                <p className="text-sm font-medium">Upload {type === "image" ? "Image" : "Audio"}</p>
                <p className="text-xs text-gray-500">
                  {type === "image" 
                    ? "JPG, PNG, WebP, or GIF up to 10MB" 
                    : "MP3, WAV, OGG, or AAC up to 10MB"
                  }
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
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept || (type === "image" ? "image/*" : "audio/*")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}; 