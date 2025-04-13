
import { useState } from "react";

interface ChartControlsProps {
  activeType: 'line' | 'bar';
  setActiveType: (type: 'line' | 'bar') => void;
}

export const ChartControls = ({ activeType, setActiveType }: ChartControlsProps) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-background border border-border rounded-lg overflow-hidden flex">
        <button
          onClick={() => setActiveType('line')}
          className={`px-3 py-1 text-xs transition ${activeType === 'line' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
        >
          Line
        </button>
        <button
          onClick={() => setActiveType('bar')}
          className={`px-3 py-1 text-xs transition ${activeType === 'bar' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
        >
          Bar
        </button>
      </div>
    </div>
  );
};
