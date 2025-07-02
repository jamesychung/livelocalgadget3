import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Trash2, Upload } from "lucide-react";

interface MultipleAudioUploadProps {
  audioFiles: string[];
  onChange: (audioFiles: string[]) => void;
}

export const MultipleAudioUpload: React.FC<MultipleAudioUploadProps> = ({ audioFiles, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAudioFiles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Convert to base64 for persistence
      const base64 = await fileToBase64(file);
      newAudioFiles.push(base64);
    }
    onChange([...audioFiles, ...newAudioFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = [...audioFiles];
    updated.splice(index, 1);
    onChange(updated);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-4">
        {audioFiles.map((audio, idx) => (
          <div key={idx} className="flex flex-col items-center border rounded-lg p-2 bg-gray-50 relative">
            <audio controls src={audio} className="w-48" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 text-red-500 hover:bg-red-100"
              onClick={() => handleRemove(idx)}
              title="Remove audio"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload Audio
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
    </div>
  );
}; 
