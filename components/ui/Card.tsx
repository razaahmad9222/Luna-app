
import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Card = React.forwardRef<View, React.ComponentProps<typeof View>>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("rounded-xl border bg-white border-gray-100 shadow-sm", className)} {...props} />
));

export const CardHeader = React.forwardRef<View, React.ComponentProps<typeof View>>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

export const CardTitle = React.forwardRef<Text, React.ComponentProps<typeof Text>>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn("text-lg font-bold text-gray-900 leading-none tracking-tight", className)} {...props} />
));

export const CardContent = React.forwardRef<View, React.ComponentProps<typeof View>>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
