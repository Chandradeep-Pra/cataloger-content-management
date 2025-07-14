'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CircularProgress } from '../CircularProgressBar';

interface FileUploadProps {
  value: string[];
  onChange: (files: string[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

export function FileUpload({
  value = [],
  onChange,
  maxFiles = 5,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  className,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadingPreviews, setUploadingPreviews] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);



  const onDrop = useCallback(async (acceptedFiles: File[]) => {
  const remaining = maxFiles - value.length;
  if (remaining <= 0) return;

  const selected = acceptedFiles.slice(0, remaining);
  setUploading(true);

  for (const file of selected) {
    // Generate preview
    const reader = new FileReader();
    const preview: string = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    setPreviews((prev) => [...prev, preview]);
    setUploadProgress((prev) => ({ ...prev, [preview]: 0 }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulated progress animation (optional)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [preview]: Math.min(progress, 95) }));
      }, 150);

      const res = await fetch('/api/uploadOnCloudinary', {
        method: 'POST',
        body: formData,
      });
      clearInterval(interval);

      const json = await res.json();
      if (!json.publicId) throw new Error('Upload failed');

      setUploadProgress((prev) => ({ ...prev, [preview]: 100 }));
      onChange([...value, json.publicId]); // ✅ append publicId
      toast.success("Uploaded");
    } catch (err) {
      toast.error("Upload failed");
      setPreviews((prev) => prev.filter((p) => p !== preview));
    }
  }

  setUploading(false);
}, [value, onChange, maxFiles]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newValues = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newValues);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {(value.length + previews.length) < maxFiles && (
        <Card
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50',
            isDragActive && 'border-primary bg-primary/5'
          )}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <div className="text-xl font-semibold">
              {isDragActive ? 'Drop files here' : 'Upload images'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Drag and drop or click to select images
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} images, 10MB each
            </p>
          </CardContent>
        </Card>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => {
            const isUploading = uploadingPreviews.has(preview);

            return (
              <div key={index} className="relative group">
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="aspect-square relative">
        <img
          src={preview}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Show circular progress during upload */}
        {uploadProgress[preview] !== undefined && uploadProgress[preview] < 100 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <CircularProgress value={uploadProgress[preview]} />
          </div>
        )}

        {/* Show delete button once upload is complete */}
        {uploadProgress[preview] === 100 && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeFile(index)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
</div>

            );
          })}
        </div>
      )}

      {value.length >= maxFiles && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum {maxFiles} images allowed
        </p>
      )}
    </div>
  );
}
