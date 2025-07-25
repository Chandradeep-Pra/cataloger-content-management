import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterOption = {
  key: string; // e.g., "status", "level"
  label: string; // e.g., "Status"
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (val: string) => void;
};

type SearchAndFilterProps = {
  searchValue: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  filters?: FilterOption[];
  className?: string;
};

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  filters = [],
  className,
}: SearchAndFilterProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}
