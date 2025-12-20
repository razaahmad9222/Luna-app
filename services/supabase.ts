
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

// In a real application, these should be in environment variables
// process.env.REACT_APP_SUPABASE_URL
// process.env.REACT_APP_SUPABASE_ANON_KEY

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
