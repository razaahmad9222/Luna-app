
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'luna';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(({ className, variant = 'default', size = 'default', children, disabled, ...props }, ref) => {
  const variants = {
    default: "bg-purple-600",
    secondary: "bg-gray-100",
    outline: "border border-gray-200 bg-transparent",
    ghost: "bg-transparent",
    luna: "bg-purple-600", // Gradient not supported in simple Views without library, using solid for now or could use View inside
  };
  
  const textVariants = {
    default: "text-white",
    secondary: "text-gray-900",
    outline: "text-gray-900",
    ghost: "text-gray-900",
    luna: "text-white",
  };
  
  const sizes = {
    default: "h-12 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-14 px-8",
    icon: "h-10 w-10",
  };

  return (
    <TouchableOpacity
      ref={ref}
      className={cn(
        "flex-row items-center justify-center rounded-xl",
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      <Text className={cn("font-bold text-base", textVariants[variant])}>
        {children}
      </Text>
    </TouchableOpacity>
  );
});
