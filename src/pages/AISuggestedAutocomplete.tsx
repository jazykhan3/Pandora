import React from "react";
import { Sparkles } from "lucide-react";

export default function AISuggestedAutocomplete({ suggestions = [] }: { suggestions?: string[] }) {
  if (!suggestions.length) return null;

  return (
    <div className="absolute bottom-2 left-2 bg-white border border-light rounded shadow-lg p-3 text-sm z-50 w-[300px]">
      <div className="flex items-center gap-2 text-primary font-medium mb-2">
        <Sparkles className="w-4 h-4 text-accent" />
        AI Suggestions
      </div>
      <ul className="space-y-1">
        {suggestions.map((text, index) => (
          <li
            key={index}
            className="px-3 py-1 rounded hover:bg-accent-light cursor-pointer"
            onClick={() => navigator.clipboard.writeText(text)}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
