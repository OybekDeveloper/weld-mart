import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils"; // ShadCN utility for className merging
import { CloudUpload, Paperclip } from "lucide-react";

// FileUploader Component
export function FileUploader({
  value,
  onValueChange,
  dropzoneOptions,
  className,
  children,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    onDrop: (acceptedFiles) => {
      onValueChange(acceptedFiles);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-lg border border-dashed p-2",
        isDragActive && "bg-muted",
        className
      )}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

// FileInput Component
export function FileInput({ id, className, children }) {
  return (
    <div className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}

// FileUploaderContent Component
export function FileUploaderContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

// FileUploaderItem Component
export function FileUploaderItem({ index, children }) {
  return (
    <div className="flex items-center gap-2 p-1">
      {children}
    </div>
  );
}