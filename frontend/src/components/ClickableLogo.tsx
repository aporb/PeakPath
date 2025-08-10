'use client';

import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

interface ClickableLogoProps {
  showAlpha?: boolean;
  className?: string;
}

export function ClickableLogo({ showAlpha = true, className = "" }: ClickableLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">PP</span>
      </div>
      <span className="text-xl font-bold text-slate-900">PeakPath</span>
      {showAlpha && (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Alpha
        </Badge>
      )}
    </Link>
  );
}