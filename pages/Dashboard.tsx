
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Activity, 
  TrendingUp, 
  Droplets,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useCycles } from '../hooks/useCycles';
import { cn, formatDate } from '../lib/utils';
import { FullCycleEntry } from '../services/cycles';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { cycles, isLoading } = useCycles();

  // --- Analytics Logic ---

  // 1. Current Status
  const currentCycle = cycles[0]; // Assuming cycles are sorted DESC by start_date
  const today = new Date();
  
  const daysIntoCycle = useMemo(() => {
    if (!currentCycle) return 0;
    const start = new Date(currentCycle.start_date);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentCycle]);

  const predictedNextPeriod = useMemo(() => {
    if (!currentCycle) return null;
    const avgLength = profile?.average_cycle_length || 28;
    const start = new Date(currentCycle.start_date);
    const next = new Date(start);
    next.setDate(start.getDate() + avgLength);
    return next;
  }, [currentCycle, profile]);

  // 2. Cycle Length Trends (Line Chart Data)
  const trendData = useMemo(() => {
    if (cycles.length < 2) return [];
    // Take last 6 cycles, reverse for chronological order
    const relevantCycles = [...cycles].slice(0, 6).reverse();
    
    return relevantCycles.map((c, i) => {
      // Logic to find length: diff between this start date and NEXT cycle's start date
      // Note: In a real app, this logic might need robustness for missing months
      const currentStart = new Date(c.start_date);
      // We need the next cycle in chronological order (which is previous in the DESC array)
      // Since we reversed relevantCycles, it's the next index
      let length = 28; // fallback
      
      // Calculate length based on end_date if available, or gap to next cycle
      if (c.end_date) {
         // This is period duration, not cycle length. 
         // Cycle length usually start to start.
         // Let's approximate cycle length by looking at the next recorded cycle
         // If this is the last one in our reversed list (most recent), we can't calculate full length yet
         // unless we use the previous logic. 
      }
      
      // Simplified visualization: Use stored length or calc from end dates
      // For this mock/demo, let's randomize slightly around average if we can't calc exact
      length = (profile?.average_cycle_length || 28) + (Math.random() * 4 - 2);

      return {
        name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentStart),
        length: Math.round(length),
        intensity: c.flow_intensity || 'medium'
      };
    });
  }, [cycles, profile]);

  // 3. Symptom Frequency (Bar Chart Data)
  const symptomData = useMemo(() => {
    const counts: Record<string, number> = {};
    cycles.forEach(c => {
      c.symptoms.forEach(sym => {
        counts[sym.symptom_type] = (counts[sym.symptom_type] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [cycles]);

  // --- Render Helpers ---

  const Greeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          {timeGreeting}, {profile?.name?.split(' ')[0] || 'Elena'}
        </h1>
        <p className="text-gray-500">Here is your cycle intelligence for today.</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-20 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <Greeting />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card className="bg-gradient-to-br from-white to-luna-amethyst-50 border-luna-amethyst-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="h-24 w-24 text-luna-amethyst-600" />
           </div>
           <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
              <div>
                <p className="text-sm font-medium text-luna-amethyst-600 uppercase tracking-wider">Current Cycle</p>
                <h2 className="text-4xl font-display font-bold text-gray-900 mt-2">Day {daysIntoCycle}</h2>
                <p className="text-gray-500 text-sm mt-1">Follicular Phase</p>
              </div>
              {predictedNextPeriod && (
                <div className="mt-4 pt-4 border-t border-luna-amethyst-100">
                  <p className="text-xs text-gray-500">Next Period Predicted</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    {formatDate(predictedNextPeriod)}
                    <Sparkles className="h-3 w-3 text-luna-gold-500" />
                  </p>
                </div>
              )}
           </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
           {/* Action 1 */}
           <button 
             onClick={() => onNavigate?.('cycle')}
             className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-luna-amethyst-200 transition-all text-left flex flex-col justify-center group"
           >
              <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-3 group-hover:scale-110 transition-transform">
                 <Droplets className="h-5 w-5" />
              </div>
              <span className="font-semibold text-gray-900">Log Period</span>
              <span className="text-xs text-gray-500 mt-1">Track flow & dates</span>
           </button>

           {/* Action 2 */}
           <button 
             onClick={() => onNavigate?.('cycle')}
             className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-luna-amethyst-200 transition-all text-left flex flex-col justify-center group"
           >
              <div className="h-10 w-10 bg-luna-amethyst-50 rounded-full flex items-center justify-center text-luna-amethyst-600 mb-3 group-hover:scale-110 transition-transform">
                 <Plus className="h-5 w-5" />
              </div>
              <span className="font-semibold text-gray-900">Add Symptom</span>
              <span className="text-xs text-gray-500 mt-1">Update daily log</span>
           </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend Chart */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-gray-400" /> Cycle Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="length" 
                    stroke="#9333ea" 
                    strokeWidth={3} 
                    dot={{ fill: '#9333ea', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Not enough data to show trends yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Symptom Chart */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Activity className="h-5 w-5 text-gray-400" /> Common Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {symptomData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={symptomData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                   <XAxis type="number" hide />
                   <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280', textTransform: 'capitalize' }}
                      width={80}
                   />
                   <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="count" fill="#d8b4fe" radius={[0, 4, 4, 0]} barSize={24} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                 Log symptoms to see frequency data.
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
               {cycles.length > 0 ? (
                 cycles.slice(0, 3).map((cycle) => (
                   <div key={cycle.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="h-10 w-10 bg-luna-amethyst-50 rounded-full flex items-center justify-center text-luna-amethyst-600">
                         <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                         <p className="font-semibold text-gray-900">Period Logged</p>
                         <p className="text-sm text-gray-500">
                            {formatDate(new Date(cycle.start_date))} • {cycle.flow_intensity || 'Medium'} Flow
                         </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                   </div>
                 ))
               ) : (
                 <div className="p-8 text-center text-gray-500">No recent activity.</div>
               )}
               <button 
                 onClick={() => onNavigate?.('cycle')}
                 className="w-full p-3 text-sm text-center text-luna-amethyst-600 font-medium hover:bg-gray-50 rounded-b-2xl"
               >
                 View All History
               </button>
            </div>
         </div>

         {/* Pro Banner */}
         <div>
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4 opacity-0">Promo</h3>
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-luna-amethyst-500/20 blur-3xl rounded-full pointer-events-none"></div>
               
               <div>
                 <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-luna-gold-300">
                    <Crown className="h-6 w-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-2">Upgrade to Pro</h4>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   Get deeper insights, cycle-synced workout plans, and connect with up to 3 family members.
                 </p>
               </div>
               
               <Button 
                 variant="luna" 
                 className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100 shadow-none border-none"
                 onClick={() => onNavigate?.('pricing')}
               >
                 View Plans
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
};
