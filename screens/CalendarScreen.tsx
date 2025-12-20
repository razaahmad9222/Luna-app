
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon } from 'lucide-react-native';

const CalendarScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9] items-center justify-center p-6">
      <View className="bg-purple-50 p-6 rounded-full mb-6">
        <CalendarIcon size={48} color="#9333ea" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center font-serif">Calendar Sync</Text>
      <Text className="text-gray-500 text-center mb-8">
        Your synced events and cycle predictions will appear here. Feature coming soon.
      </Text>
    </SafeAreaView>
  );
};

export default CalendarScreen;
