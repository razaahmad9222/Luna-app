
import React from 'react';
import Toast from 'react-native-toast-message';

// Hook to provide API compatibility with web version
export const useToast = () => {
  const toast = ({ title, description, type }: { title: string; description?: string; type: 'success' | 'error' | 'info' }) => {
    Toast.show({
      type: type,
      text1: title,
      text2: description,
    });
  };

  return { toast };
};

// Provider is no-op as Toast is global in App.tsx
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
