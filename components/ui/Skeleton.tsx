
import React from 'react';
import { View } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("rounded-md bg-gray-200 opacity-50", className)}
      {...props}
    />
  );
};
