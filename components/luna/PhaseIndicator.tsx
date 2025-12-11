
import React from 'react';
import { CyclePhase } from '../../types';
import { PHASE_CONFIG } from '../../constants';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Props {
  phase: CyclePhase;
  day: number;
}

export const PhaseIndicator: React.FC<Props> = ({ phase, day }) => {
  const config = PHASE_CONFIG[phase];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-luna-amethyst-100">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Phase</span>
          <h2 className="mt-1 text-3xl font-display font-bold text-gray-900 flex items-center gap-2">
             {config.name} <span className="text-2xl">{config.emoji}</span>
          </h2>
          <p className="text-luna-amethyst-600 font-medium">Day {day} of Cycle</p>
        </div>
        <div className="relative h-16 w-16">
          {/* Simple circular progress visualization */}
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <motion.path
              className={cn("text-primary", config.color)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.35 }} // Mock progress
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={config.color}
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
            {day}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
        <div className="flex flex-wrap gap-2">
          {config.recommendations.map((rec, i) => (
            <span key={i} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {rec}
            </span>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-xl", config.bgColor)} />
    </div>
  );
};
