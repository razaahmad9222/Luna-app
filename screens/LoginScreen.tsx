
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';
import { useToast } from '../components/ui/Toast';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ type: 'error', title: 'Missing fields', description: 'Please enter both email and password.' });
      return;
    }

    setIsLoading(true);
    const { error } = await authService.signIn(email, password);
    
    if (error) {
      toast({ type: 'error', title: 'Login Failed', description: error.message });
      setIsLoading(false);
    }
    // Success handled by AuthProvider listener
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9] px-6 justify-center">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-serif">Welcome Back</Text>
        <Text className="text-gray-500">Sign in to sync your cycle.</Text>
      </View>

      <View className="space-y-4 mb-6">
        <View className="space-y-2">
          <Text className="text-sm font-medium text-gray-700 ml-1">Email</Text>
          <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 h-12">
            <Mail size={20} color="#9ca3af" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="flex-1 ml-3 text-base text-gray-900 h-full"
              placeholder="elena@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View className="space-y-2">
          <Text className="text-sm font-medium text-gray-700 ml-1">Password</Text>
          <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 h-12">
            <Lock size={20} color="#9ca3af" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              className="flex-1 ml-3 text-base text-gray-900 h-full"
              placeholder="••••••••"
              secureTextEntry
            />
          </View>
        </View>
      </View>

      <Button 
        onPress={handleLogin}
        disabled={isLoading}
        variant="luna"
      >
        {isLoading ? (
          <Loader size={20} color="white" />
        ) : (
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-bold">Sign In</Text>
            <ArrowRight size={16} color="white" />
          </View>
        )}
      </Button>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        className="mt-8 items-center"
      >
        <Text className="text-gray-600">
          Don't have an account? <Text className="font-bold text-purple-600">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;
