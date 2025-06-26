'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  className 
}: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const newPreviews: string[] = [];
//     const newValues: string[] = [];

//     acceptedFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const result = reader.result as string;
//         newPreviews.push(result);
//         newValues.push(result);
        
//         if (newPreviews.length === acceptedFiles.length) {
//           const updatedPreviews = [...previews, ...newPreviews].slice(0, maxFiles);
//           const updatedValues = [...value, ...newValues].slice(0, maxFiles);
//           setPreviews(updatedPreviews);
//           onChange(updatedValues);
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   }, [previews, value, onChange, maxFiles]);


const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newPreviews: string[] = [];
    const newCloudinaryIds: string[] = [];

    for (const file of acceptedFiles.slice(0, maxFiles - value.length)) {
      // 1. Show preview
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        newPreviews.push(result);
        setPreviews((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);

      // 2. Upload to /api/upload (Cloudinary)
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/uploadOnCloudinary', {
          method: 'POST',
          body: formData
        });

        const json = await res.json();
        if (json.success) {
          // Use `public_id` or `secure_url` depending on what you want to store
          newCloudinaryIds.push(json.data.public_id);
        } else {
          console.error('Upload failed:', json.error || json.message);
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    onChange([...value, ...newCloudinaryIds]);
  }, [value, onChange, maxFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles
  });

  const removeFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newValues = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newValues);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value.length < maxFiles && (
        <Card 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5"
          )}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <input {...getInputProps()} />
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Upload className={cn(
                "h-10 w-10 text-muted-foreground mb-4",
                isDragActive && "text-primary"
              )} />
              <div className="text-xl font-semibold">
                {isDragActive ? "Drop files here" : "Upload images"}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, JPEG, GIF, WEBP up to 10MB each
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
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