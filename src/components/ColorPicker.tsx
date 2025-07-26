'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash } from 'lucide-react';

type ColorPickerProps = {
  colors: string[];
  onChange: (colors: string[]) => void;
};

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [showPicker, setShowPicker] = useState(false);

  const handleAddColor = () => {
    if (!colors.includes(currentColor)) {
      onChange([...colors, currentColor]);
    }
    setShowPicker(false);
  };

  const handleRemoveColor = (colorToRemove: string) => {
    onChange(colors.filter((c) => c !== colorToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div key={color} className="flex items-center gap-1">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveColor(color)}
              className="h-5 w-5 p-0"
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button variant="outline">Pick Color</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 flex flex-col items-center gap-2">
          <HexColorPicker color={currentColor} onChange={setCurrentColor} />
          <Button size="sm" onClick={handleAddColor}>
            Add Color
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
