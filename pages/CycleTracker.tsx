
import React, { useState } from 'react';
import { Calendar, Plus, TrendingUp, Activity, Heart, Droplets, Moon, Sun, Cloud, Zap, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface CycleEntry {
  id: string;
  startDate: Date;
  endDate: Date | null;
  flowIntensity: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes: string;
}

interface Symptom {
  id: string;
  name: string;
  icon: any;
  category: 'physical' | 'emotional' | 'energy';
}

// Prediction Algorithm
const predictNextPeriod = (cycles: CycleEntry[]): { date: Date; confidence: number } | null => {
  if (cycles.length < 2) return null;
  
  const completedCycles = cycles.filter(c => c.endDate);
  if (completedCycles.length === 0) return null;
  
  const cycleLengths = completedCycles.map(c => {
    const start = new Date(c.startDate).getTime();
    const end = new Date(c.endDate!).getTime();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  });
  
  const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  // Calculate variance to determine consistency
  const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length;
  const stdDev = Math.sqrt(variance);
  
  // Higher standard deviation = lower confidence
  // Base confidence starts at 95 and subtracts based on irregularity
  const confidence = Math.max(50, Math.min(95, 100 - (stdDev * 5)));
  
  const lastCycle = cycles[cycles.length - 1];
  const lastDate = new Date(lastCycle.endDate || lastCycle.startDate);
  const nextDate = new Date(lastDate.getTime() + avgLength * 24 * 60 * 60 * 1000);
  
  return { date: nextDate, confidence: Math.round(confidence) };
};

export const CycleTracker: React.FC = () => {
  const [cycles, setCycles] = useState<CycleEntry[]>([
    {
      id: '1',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-20'),
      flowIntensity: 'medium',
      symptoms: ['cramps', 'fatigue'],
      notes: 'Standard cycle, slightly lower energy than usual.'
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    flowIntensity: 'medium' as const,
    symptoms: [] as string[],
    notes: ''
  });

  const symptoms: Symptom[] = [
    { id: 'cramps', name: 'Cramps', icon: Activity, category: 'physical' },
    { id: 'headache', name: 'Headache', icon: Zap, category: 'physical' },
    { id: 'bloating', name: 'Bloating', icon: Cloud, category: 'physical' },
    { id: 'fatigue', name: 'Fatigue', icon: Moon, category: 'energy' },
    { id: 'energetic', name: 'Energetic', icon: Sun, category: 'energy' },
    { id: 'moody', name: 'Mood Swings', icon: Heart, category: 'emotional' },
  ];

  const addCycle = () => {
    const entry: CycleEntry = {
      id: Date.now().toString(),
      startDate: new Date(newEntry.startDate),
      endDate: newEntry.endDate ? new Date(newEntry.endDate) : null,
      flowIntensity: newEntry.flowIntensity,
      symptoms: newEntry.symptoms,
      notes: newEntry.notes
    };
    
    setCycles((prev) => [...prev, entry].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
    setShowAddModal(false);
    // Reset form
    setNewEntry({
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      flowIntensity: 'medium',
      symptoms: [],
      notes: ''
    });
  };

  const prediction = predictNextPeriod(cycles);
  
  const avgCycleLength = cycles.length > 1 
    ? Math.round(cycles.slice(-3).reduce((sum, c, i, arr) => {
        if (i === 0) return 0;
        const prev = arr[i - 1];
        return sum + (new Date(c.startDate).getTime() - new Date(prev.startDate).getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / (cycles.length - 1))
    : 28;

  const toggleSymptom = (symptomId: string) => {
    setNewEntry(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(s => s !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const getFlowColor = (intensity: string) => {
    switch(intensity) {
      case 'heavy': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-luna-amethyst-600 bg-luna-amethyst-50 border-luna-amethyst-200';
      case 'light': return 'text-pink-500 bg-pink-50 border-pink-200';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Cycle Tracker</h1>
          <p className="text-gray-500 mt-1">Log your periods to unlock personalized predictions.</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="luna"
          className="shadow-md shrink-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Log Period
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prediction Card */}
        <div className="md:col-span-3 lg:col-span-1">
          {prediction ? (
            <Card className="h-full bg-gradient-to-br from-white to-luna-amethyst-50/50 border-luna-amethyst-200 shadow-md">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-luna-amethyst-100 rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp className="h-6 w-6 text-luna-amethyst-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Next Period</h3>
                    <p className="text-3xl font-display font-bold text-luna-amethyst-900 mt-1">
                      {formatDate(prediction.date)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-luna-amethyst-200 shadow-sm">
                        <Calendar className="h-3.5 w-3.5 text-luna-amethyst-500" />
                        <span className="text-xs font-medium text-gray-700">~{avgCycleLength} days</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-luna-amethyst-600 text-white shadow-sm">
                        <Activity className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">{prediction.confidence}% Confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card className="h-full bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
                   <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                   <p className="text-sm">Log at least 2 cycles to see predictions.</p>
                </CardContent>
             </Card>
          )}
        </div>

        {/* History List */}
        <div className="md:col-span-3 lg:col-span-2">
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                 <Calendar className="h-5 w-5 text-gray-400" /> Recent History
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-gray-100">
              {cycles.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No cycles logged yet.</div>
              ) : (
                cycles.slice().reverse().map((cycle) => (
                  <motion.div 
                    key={cycle.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-lg text-gray-900">
                            {formatDate(cycle.startDate)} 
                            {cycle.endDate && ` - ${formatDate(cycle.endDate)}`}
                          </span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize font-medium", getFlowColor(cycle.flowIntensity))}>
                            {cycle.flowIntensity}
                          </span>
                        </div>
                        
                        {cycle.notes && (
                          <p className="text-sm text-gray-500 italic max-w-lg">"{cycle.notes}"</p>
                        )}

                        {cycle.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {cycle.symptoms.map(s => (
                              <span key={s} className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-xs shadow-sm">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Visual indicator of cycle length if available */}
                      {cycle.endDate && (
                        <div className="flex flex-col items-end justify-center min-w-[80px]">
                           <span className="text-2xl font-bold text-luna-amethyst-200 group-hover:text-luna-amethyst-300 transition-colors">
                             {Math.ceil((cycle.endDate.getTime() - cycle.startDate.getTime()) / (1000 * 60 * 60 * 24))}
                           </span>
                           <span className="text-[10px] uppercase font-bold text-gray-400">Days</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-gray-900">Log Period</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Start Date</label>
                    <input
                      type="date"
                      value={newEntry.startDate}
                      onChange={(e) => setNewEntry({ ...newEntry, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luna-amethyst-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">End Date</label>
                    <input
                      type="date"
                      value={newEntry.endDate}
                      onChange={(e) => setNewEntry({ ...newEntry, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luna-amethyst-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Flow Intensity</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'medium', 'heavy'] as const).map(intensity => (
                      <button
                        key={intensity}
                        onClick={() => setNewEntry({ ...newEntry, flowIntensity: intensity })}
                        className={cn(
                          "px-3 py-2 rounded-xl border transition-all capitalize text-sm font-medium",
                          newEntry.flowIntensity === intensity
                            ? "border-luna-amethyst-500 bg-luna-amethyst-50 text-luna-amethyst-700 ring-1 ring-luna-amethyst-500"
                            : "border-gray-200 hover:border-luna-amethyst-200 hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Symptoms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map(symptom => {
                      const Icon = symptom.icon;
                      const isSelected = newEntry.symptoms.includes(symptom.id);
                      return (
                        <button
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-sm text-left",
                            isSelected
                              ? "border-luna-amethyst-500 bg-luna-amethyst-50 text-luna-amethyst-700 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", isSelected ? "text-luna-amethyst-600" : "text-gray-400")} />
                          {symptom.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Notes</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="How are you feeling?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luna-amethyst-500 focus:border-transparent outline-none resize-none text-sm"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="luna"
                  onClick={addCycle}
                  className="flex-1 shadow-md"
                >
                  Save Entry
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
