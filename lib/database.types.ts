
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          onboarding_complete: boolean
          average_cycle_length: number
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          onboarding_complete?: boolean
          average_cycle_length?: number
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          onboarding_complete?: boolean
          average_cycle_length?: number
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      cycles: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string | null
          flow_intensity: 'light' | 'medium' | 'heavy' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date?: string | null
          flow_intensity?: 'light' | 'medium' | 'heavy' | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string | null
          flow_intensity?: 'light' | 'medium' | 'heavy' | null
          notes?: string | null
          created_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          cycle_id: string
          user_id: string
          symptom_type: string
          severity: number
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cycle_id: string
          user_id: string
          symptom_type: string
          severity?: number
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cycle_id?: string
          user_id?: string
          symptom_type?: string
          severity?: number
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          predicted_date: string
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          predicted_date: string
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          predicted_date?: string
          confidence_score?: number | null
          created_at?: string
        }
      }
    }
  }
}
