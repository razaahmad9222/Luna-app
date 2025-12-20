
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth';
import { useToast } from '../components/ui/Toast';

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({ type: 'error', title: 'Missing fields', description: 'Please fill in all fields.' });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ type: 'error', title: 'Mismatch', description: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    const { error } = await authService.signUp(email, password, name);
    
    if (error) {
      toast({ type: 'error', title: 'Signup Failed', description: error.message });
      setIsLoading(false);
    } else {
      toast({ type: 'success', title: 'Account Created', description: 'Check email to verify.' });
      navigation.navigate('Login');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9]">
      <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', minHeight: '100%' }}>
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2 font-serif">Create Account</Text>
          <Text className="text-gray-500">Join Luna today.</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 ml-1">Full Name</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 h-12">
              <User size={20} color="#9ca3af" />
              <TextInput
                value={name}
                onChangeText={setName}
                className="flex-1 ml-3 text-base text-gray-900 h-full"
                placeholder="Elena Fisher"
              />
            </View>
          </View>

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
                placeholder="Create password"
                secureTextEntry
              />
            </View>
          </View>
          
           <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 ml-1">Confirm Password</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 h-12">
              <Lock size={20} color="#9ca3af" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="flex-1 ml-3 text-base text-gray-900 h-full"
                placeholder="Confirm password"
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <Button 
          onPress={handleSignup}
          disabled={isLoading}
          variant="luna"
        >
          {isLoading ? (
            <Loader size={20} color="white" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-bold">Create Account</Text>
              <ArrowRight size={16} color="white" />
            </View>
          )}
        </Button>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          className="mt-8 items-center"
        >
          <Text className="text-gray-600">
            Already have an account? <Text className="font-bold text-purple-600">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
