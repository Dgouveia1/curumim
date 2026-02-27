import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
  subtext?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color, subtext }) => {
  return (
    <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16" style={{ color }} />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gray-800/80 border border-gray-700/50">
            <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-800 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend}
            </span>
        )}
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
};