
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { CyclePhase } from '../../types';
import { PHASE_CONFIG } from '../../constants';
import clsx from 'clsx';

interface Props {
  phase: CyclePhase;
  day: number;
}

export const PhaseIndicator: React.FC<Props> = ({ phase, day }) => {
  const config = PHASE_CONFIG[phase];
  const size = 64;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.35; // Mock progress
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-purple-100 mb-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Phase</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-3xl font-serif font-bold text-gray-900 mr-2">{config.name}</Text>
            <Text className="text-2xl">{config.emoji}</Text>
          </View>
          <Text className="text-purple-600 font-medium">Day {day} of Cycle</Text>
        </View>
        
        <View className="relative items-center justify-center" style={{ width: size, height: size }}>
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={config.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
             <Text className="text-sm font-bold text-gray-700">{day}</Text>
          </View>
        </View>
      </View>
      
      <View className="mt-4">
        <Text className="text-sm text-gray-600 mb-2">{config.description}</Text>
        <View className="flex-row flex-wrap gap-2">
          {config.recommendations.map((rec, i) => (
            <View key={i} className="rounded-full bg-gray-100 px-3 py-1">
              <Text className="text-xs font-medium text-gray-800">
                {rec}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Background decoration */}
      <View 
        className={clsx("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10", config.bgColor.replace('bg-', 'bg-'))} 
        style={{ backgroundColor: config.color }}
      />
    </View>
  );
};
