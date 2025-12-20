
import { supabase } from './supabase';
import { Database } from '../lib/database.types';

type Cycle = Database['public']['Tables']['cycles']['Row'];
type Symptom = Database['public']['Tables']['symptoms']['Row'];

// Combined type for UI consumption
export interface FullCycleEntry extends Cycle {
  symptoms: Symptom[];
}

export const cyclesService = {
  /**
   * Fetches all cycles for the current user, including related symptoms.
   */
  async getCycles() {
    const { data, error } = await supabase
      .from('cycles')
      .select(`
        *,
        symptoms (*)
      `)
      .order('start_date', { ascending: false });

    return { data: data as FullCycleEntry[] | null, error };
  },

  /**
   * Adds a new cycle entry. 
   * Note: Symptoms are handled separately or ideally via a transaction logic 
   * if inserting bulk, but here we provide the base cycle creator.
   */
  async addCycle(cycle: Database['public']['Tables']['cycles']['Insert']) {
    const { data, error } = await supabase
      .from('cycles')
      .insert(cycle)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Updates an existing cycle.
   */
  async updateCycle(id: string, updates: Database['public']['Tables']['cycles']['Update']) {
    const { data, error } = await supabase
      .from('cycles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Deletes a cycle. Cascading delete in SQL handles symptoms.
   */
  async deleteCycle(id: string) {
    const { error } = await supabase
      .from('cycles')
      .delete()
      .eq('id', id);

    return { error };
  },

  /**
   * Adds a symptom to a specific cycle.
   */
  async addSymptom(symptom: Database['public']['Tables']['symptoms']['Insert']) {
    const { data, error } = await supabase
      .from('symptoms')
      .insert(symptom)
      .select()
      .single();

    return { data, error };
  },

  async deleteSymptom(id: string) {
    const { error } = await supabase
      .from('symptoms')
      .delete()
      .eq('id', id);
      
    return { error };
  }
};
