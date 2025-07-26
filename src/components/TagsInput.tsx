'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ tags, onChange }: TagsInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const handleRemove = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
          >
            <span className="text-muted-foreground">#{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => handleRemove(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <Input
        placeholder="Add a tag and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
    </div>
  );
}
