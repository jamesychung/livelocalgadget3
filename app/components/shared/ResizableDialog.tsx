import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ResizableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleIcon?: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
  contentClassName?: string;
}

export function ResizableDialog({
  open,
  onOpenChange,
  title,
  titleIcon,
  leftPanel,
  rightPanel,
  initialLeftWidth = 33,
  minLeftWidth = 20,
  maxLeftWidth = 60,
  className = "max-w-6xl h-[80vh]",
  contentClassName = ""
}: ResizableDialogProps) {
  // Resizable panel state
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Handle mouse down on resize handle
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(leftPanelWidth);
  };

  // Handle mouse move during resize
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX;
      const containerWidth = 1000; // approximate dialog width
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, startWidth + deltaPercent));
      
      setLeftPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, minLeftWidth, maxLeftWidth]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${className} p-0 flex flex-col ${contentClassName}`}>
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {titleIcon}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 min-h-0">
          {/* Left Panel */}
          <div className="border-r border-gray-200 overflow-y-auto" style={{ width: `${leftPanelWidth}%` }}>
            {leftPanel}
          </div>

          {/* Resize Handle */}
          <div
            className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0 transition-colors ${
              isResizing ? 'bg-blue-400' : ''
            }`}
            onMouseDown={handleMouseDown}
          />

          {/* Right Panel */}
          <div className="flex flex-col min-h-0" style={{ width: `${100 - leftPanelWidth}%` }}>
            {rightPanel}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 