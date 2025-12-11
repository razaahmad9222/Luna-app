
export enum CyclePhase {
  MENSTRUAL = 'MENSTRUAL',
  FOLLICULAR = 'FOLLICULAR',
  OVULATORY = 'OVULATORY',
  LUTEAL = 'LUTEAL',
}

export enum EventType {
  DEEP_FOCUS = 'DEEP_FOCUS',
  PRESENTING = 'PRESENTING',
  COLLABORATIVE = 'COLLABORATIVE',
  HIGH_STAKES = 'HIGH_STAKES',
  ADMIN_LIGHT = 'ADMIN_LIGHT',
  INTENSE_WORKOUT = 'INTENSE_WORKOUT',
  LIGHT_MOVEMENT = 'LIGHT_MOVEMENT',
  SOCIAL = 'SOCIAL',
  REST = 'REST',
  OTHER = 'OTHER',
}

export type PlanType = 
  | 'FREE'
  | 'PRO_MONTHLY'
  | 'PRO_YEARLY'
  | 'LIFETIME'
  | 'FAMILY_DUO'
  | 'FAMILY_PLUS'
  | 'FAMILY_LEGACY';

export type SubscriptionStatus = 
  | 'FREE'
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'EXPIRED'
  | 'LIFETIME';

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: 'INDIVIDUAL' | 'PARENT' | 'DAUGHTER';
  
  // Subscription fields
  plan: PlanType;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: Date;
  hasUsedTrial: boolean;
  
  onboardingComplete?: boolean;
  onboardingStep?: number;
  phase?: CyclePhase;
}

export interface DailyLog {
  id: string;
  date: Date;
  energyLevel?: number;
  moodLevel?: number;
  symptoms: string[];
  phase: CyclePhase;
}

export interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  eventType: EventType;
  fitScore?: number; // 0-100
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phase: CyclePhase;
  statusMessage?: string;
  lastCheckIn?: Date;
  avatarUrl?: string;
}

export interface Suggestion {
  id: string;
  type: 'RESCHEDULE' | 'PREPARE' | 'ADD_REST' | 'WORKOUT_SWAP';
  title: string;
  body: string;
  reason: string;
}

// External API Types
export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: number;
}

export interface QuoteData {
  content: string;
  author: string;
}

export interface CryptoData {
  bitcoin: {
    usd: number;
  };
}

export interface MealData {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  sourceUrl?: string;
}

export interface ArtData {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  date: string;
}

export interface BioWeatherInsight {
  wardrobe: {
    summary: string;
    details: string;
    outfitTags: string[];
  };
  nutrition: {
    focus: string;
    details: string;
    powerIngredients: string[];
  };
}
