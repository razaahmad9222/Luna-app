
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { Plus, X, Calendar as CalendarIcon, Droplets } from 'lucide-react-native';
import { useCycles } from '../hooks/useCycles';
import { formatDate } from '../lib/utils';
import clsx from 'clsx';

const CycleTrackerScreen = () => {
  const { cycles, addCycle } = useCycles();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [startDate, setStartDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [flow, setFlow] = useState<'light'|'medium'|'heavy'>('medium');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptomsList = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Energetic', 'Mood Swings'];

  const handleSubmit = async () => {
    try {
      await addCycle(startDate, undefined, flow, notes, selectedSymptoms);
      setModalVisible(false);
      // Reset form
      setNotes('');
      setSelectedSymptoms([]);
    } catch (error) {
      Alert.alert('Error', 'Could not save cycle entry.');
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFBF9]">
      <View className="p-4 flex-row justify-between items-center border-b border-gray-100 bg-white">
        <Text className="text-2xl font-serif font-bold text-gray-900">Cycle Logs</Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-purple-600 px-4 py-2 rounded-full flex-row items-center"
        >
          <Plus size={18} color="white" />
          <Text className="text-white font-bold ml-1">Log</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {cycles.length === 0 ? (
          <View className="mt-20 items-center">
            <Text className="text-gray-400 text-lg">No cycles logged yet.</Text>
          </View>
        ) : (
          cycles.map((cycle) => (
            <View key={cycle.id} className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-gray-900">
                  {formatDate(new Date(cycle.start_date))}
                </Text>
                <View className={clsx(
                  "px-2 py-1 rounded-md",
                  cycle.flow_intensity === 'heavy' ? "bg-red-100" : 
                  cycle.flow_intensity === 'medium' ? "bg-purple-100" : "bg-pink-100"
                )}>
                  <Text className={clsx(
                    "text-xs capitalize font-bold",
                    cycle.flow_intensity === 'heavy' ? "text-red-700" : 
                    cycle.flow_intensity === 'medium' ? "text-purple-700" : "text-pink-700"
                  )}>{cycle.flow_intensity}</Text>
                </View>
              </View>
              {cycle.notes && <Text className="text-gray-500 italic mb-2">"{cycle.notes}"</Text>}
              <View className="flex-row flex-wrap gap-2">
                {cycle.symptoms?.map((sym: any, idx: number) => (
                   <View key={idx} className="bg-gray-100 px-2 py-1 rounded-md">
                     <Text className="text-xs text-gray-600">{sym.symptom_type}</Text>
                   </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Log Period</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date */}
              <Text className="text-sm font-bold text-gray-500 uppercase mb-2">Start Date</Text>
              <TouchableOpacity 
                onPress={() => setOpenDatePicker(true)}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row items-center mb-6"
              >
                <CalendarIcon size={20} color="#6b7280" />
                <Text className="ml-3 text-gray-900 font-medium">{formatDate(startDate)}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={openDatePicker}
                date={startDate}
                mode="date"
                onConfirm={(date) => {
                  setOpenDatePicker(false);
                  setStartDate(date);
                }}
                onCancel={() => setOpenDatePicker(false)}
              />

              {/* Flow */}
              <Text className="text-sm font-bold text-gray-500 uppercase mb-2">Flow Intensity</Text>
              <View className="flex-row gap-3 mb-6">
                {['light', 'medium', 'heavy'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFlow(f as any)}
                    className={clsx(
                      "flex-1 py-3 rounded-xl border items-center",
                      flow === f 
                        ? "bg-purple-50 border-purple-500" 
                        : "bg-white border-gray-200"
                    )}
                  >
                    <Text className={clsx(
                      "capitalize font-medium",
                      flow === f ? "text-purple-700" : "text-gray-600"
                    )}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Symptoms */}
              <Text className="text-sm font-bold text-gray-500 uppercase mb-2">Symptoms</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {symptomsList.map((sym) => (
                  <TouchableOpacity
                    key={sym}
                    onPress={() => toggleSymptom(sym)}
                    className={clsx(
                      "px-3 py-2 rounded-lg border",
                      selectedSymptoms.includes(sym)
                        ? "bg-purple-600 border-purple-600"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <Text className={clsx(
                      "text-sm font-medium",
                      selectedSymptoms.includes(sym) ? "text-white" : "text-gray-600"
                    )}>{sym}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text className="text-sm font-bold text-gray-500 uppercase mb-2">Notes</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 mb-8 min-h-[100px]"
                multiline
                placeholder="How are you feeling?"
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />

              <TouchableOpacity 
                onPress={handleSubmit}
                className="bg-purple-600 py-4 rounded-xl items-center shadow-lg shadow-purple-200 mb-8"
              >
                <Text className="text-white font-bold text-lg">Save Log</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CycleTrackerScreen;
