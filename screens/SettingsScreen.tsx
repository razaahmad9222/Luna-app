
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const { user, profile, signOut } = useAuth();
  const [notifications, setNotifications] = React.useState(true);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut }
    ]);
  };

  const SettingItem = ({ icon: Icon, label, value, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!!value} // disable press if it has a switch or value text
      className="flex-row items-center justify-between p-4 border-b border-gray-50 bg-white"
    >
      <View className="flex-row items-center">
        <View className="bg-gray-50 p-2 rounded-full mr-3">
          <Icon size={20} color={isDestructive ? "#ef4444" : "#4b5563"} />
        </View>
        <Text className={isDestructive ? "text-red-500 font-medium" : "text-gray-900 font-medium"}>
          {label}
        </Text>
      </View>
      {value ? value : <ChevronRight size={20} color="#d1d5db" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9]">
      <ScrollView>
        <Text className="text-3xl font-serif font-bold text-gray-900 p-4">Settings</Text>

        {/* Profile Section */}
        <View className="items-center py-6 mb-4">
          <View className="h-24 w-24 bg-purple-100 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-purple-600">
              {profile?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{profile?.name || 'User'}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>

        {/* Options */}
        <View className="bg-white border-y border-gray-100">
          <SettingItem 
            icon={User} 
            label="Edit Profile" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon={Bell} 
            label="Notifications" 
            value={
              <Switch 
                value={notifications} 
                onValueChange={setNotifications} 
                trackColor={{ false: "#d1d5db", true: "#d8b4fe" }}
                thumbColor={notifications ? "#9333ea" : "#f4f3f4"}
              />
            }
          />
          <SettingItem 
            icon={Shield} 
            label="Privacy & Security" 
            onPress={() => {}} 
          />
        </View>

        <View className="mt-8 bg-white border-y border-gray-100">
          <SettingItem 
            icon={LogOut} 
            label="Sign Out" 
            isDestructive 
            onPress={handleSignOut} 
          />
        </View>
        
        <Text className="text-center text-gray-400 text-xs mt-8 pb-8">
          Version 1.0.0 (Build 42)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
