
import React, { useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Activity, Sparkles, Droplets, TrendingUp } from 'lucide-react-native';
import { useCycles } from '../hooks/useCycles';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';
import { TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const { cycles, isLoading, refresh } = useCycles();

  // --- Logic Adapted from Web ---
  const currentCycle = cycles[0];
  const today = new Date();
  
  const daysIntoCycle = useMemo(() => {
    if (!currentCycle) return 0;
    const start = new Date(currentCycle.start_date);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentCycle]);

  // Chart Config
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // luna-amethyst
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  };

  const trendData = {
    labels: cycles.slice(0, 6).reverse().map(c => new Date(c.start_date).getMonth() + 1 + "/" + new Date(c.start_date).getDate()),
    datasets: [{
      data: cycles.slice(0, 6).reverse().map(() => Math.floor(Math.random() * 4) + 26) // Mock length data
    }]
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9]">
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-serif font-bold text-gray-900">
            Good morning, {profile?.name?.split(' ')[0] || 'User'}
          </Text>
          <Text className="text-gray-500 text-base">Here is your cycle intelligence.</Text>
        </View>

        {/* Main Status Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-purple-100 overflow-hidden relative">
          <View className="absolute right-[-20] top-[-20] opacity-10">
            <Activity size={120} color="#9333ea" />
          </View>
          
          <Text className="text-purple-600 font-bold tracking-wider text-xs uppercase mb-2">Current Cycle</Text>
          <Text className="text-5xl font-serif font-bold text-gray-900 mb-1">Day {daysIntoCycle}</Text>
          <Text className="text-gray-500 font-medium mb-4">Follicular Phase</Text>
          
          <View className="border-t border-purple-50 pt-4 mt-2 flex-row items-center">
            <Sparkles size={16} color="#d4a853" />
            <Text className="text-gray-900 font-semibold ml-2">Next Period: {formatDate(new Date(Date.now() + 14 * 86400000))}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Track')}
            className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-start"
          >
            <View className="bg-rose-50 p-2 rounded-full mb-3">
              <Droplets size={20} color="#f43f5e" />
            </View>
            <Text className="font-bold text-gray-900">Log Period</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Track')}
            className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-start"
          >
            <View className="bg-purple-50 p-2 rounded-full mb-3">
              <TrendingUp size={20} color="#9333ea" />
            </View>
            <Text className="font-bold text-gray-900">Add Symptom</Text>
          </TouchableOpacity>
        </View>

        {/* Charts */}
        <Text className="text-lg font-bold text-gray-900 mb-4 ml-1">Cycle Trends</Text>
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8 items-center">
          {cycles.length > 0 ? (
            <LineChart
              data={trendData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 16 }}
              withInnerLines={false}
              withOuterLines={false}
            />
          ) : (
            <View className="h-40 justify-center">
              <Text className="text-gray-400">Log more cycles to see trends</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
