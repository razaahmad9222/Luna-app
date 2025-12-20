
import { useState, useEffect, useCallback } from 'react';
import { cyclesService, FullCycleEntry } from '../services/cycles';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/Toast';

export const useCycles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cycles, setCycles] = useState<FullCycleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCycles = useCallback(async () => {
    if (!user) {
      setCycles([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: serviceError } = await cyclesService.getCycles();
      
      if (serviceError) {
        setError(serviceError.message);
        console.error('Error fetching cycles:', serviceError);
        toast({
          type: 'error',
          title: 'Error fetching cycles',
          description: serviceError.message
        });
      } else if (data) {
        setCycles(data);
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred';
      setError(msg);
      console.error('Unexpected error in fetchCycles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const addCycle = async (startDate: Date, endDate?: Date, flow?: 'light' | 'medium' | 'heavy', notes?: string, symptoms: string[] = []) => {
    if (!user) return;

    try {
      // 1. Create Cycle
      const { data: cycleData, error: cycleError } = await cyclesService.addCycle({
        user_id: user.id,
        start_date: startDate.toISOString(),
        end_date: endDate?.toISOString(),
        flow_intensity: flow,
        notes,
      });

      if (cycleError || !cycleData) {
        throw new Error(cycleError?.message || 'Failed to create cycle record');
      }

      // 2. Add Symptoms (if any)
      if (symptoms.length > 0) {
        const symptomPromises = symptoms.map(sym => 
          cyclesService.addSymptom({
            cycle_id: cycleData.id,
            user_id: user.id,
            symptom_type: sym,
            date: startDate.toISOString(), // Defaulting symptom date to cycle start for simplicity
            severity: 3
          })
        );
        
        const results = await Promise.all(symptomPromises);
        const symptomErrors = results.filter(r => r.error);
        
        if (symptomErrors.length > 0) {
          console.warn('Some symptoms failed to save', symptomErrors);
          toast({ type: 'info', title: 'Cycle saved', description: 'Some symptoms could not be saved.' });
        }
      }

      toast({ type: 'success', title: 'Cycle Logged' });
      // Refresh list to show new data
      await fetchCycles(); 

    } catch (err: any) {
      console.error('Error adding cycle:', err);
      toast({ type: 'error', title: 'Failed to add cycle', description: err.message });
    }
  };

  const deleteCycle = async (id: string) => {
    try {
      const { error } = await cyclesService.deleteCycle(id);
      if (error) {
        throw error;
      }
      
      toast({ type: 'success', title: 'Cycle deleted' });
      // Optimistic update
      setCycles(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting cycle:', err);
      toast({ type: 'error', title: 'Failed to delete cycle', description: err.message });
      // Revert/Fetch if needed, but for delete optimistic is usually safe enough or we re-fetch
      fetchCycles();
    }
  };

  return {
    cycles,
    isLoading,
    error,
    refresh: fetchCycles,
    addCycle,
    deleteCycle
  };
};
