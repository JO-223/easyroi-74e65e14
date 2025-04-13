
import React, { ReactNode } from "react";

export interface SideCardItemProps {
  icon?: ReactNode;
  label: string;
  value: string;
}

export function SideCardItem({ icon, label, value }: SideCardItemProps) {
  return (
    <div className="flex items-start space-x-3">
      {icon && <div className="mt-0.5">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
