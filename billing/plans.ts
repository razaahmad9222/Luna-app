
import { PlanType } from '../../types';

export const PLANS = {
  FREE: {
    id: 'FREE' as PlanType,
    name: 'Free',
    description: 'Basic cycle tracking',
    price: 0,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: false,
      advancedInsights: false,
      autoReschedule: false,
      familyFeatures: false,
      maxFamilyMembers: 0,
    },
  },

  PRO_MONTHLY: {
    id: 'PRO_MONTHLY' as PlanType,
    name: 'Pro Monthly',
    description: 'Full power for individuals',
    price: 1499,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: false,
      maxFamilyMembers: 0,
    },
  },

  PRO_YEARLY: {
    id: 'PRO_YEARLY' as PlanType,
    name: 'Pro Annual',
    description: 'Best value for individuals',
    price: 11988,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: false,
      maxFamilyMembers: 0,
    },
  },

  LIFETIME: {
    id: 'LIFETIME' as PlanType,
    name: 'Lifetime',
    description: 'One-time purchase, forever access',
    price: 19900,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: false,
      maxFamilyMembers: 0,
    },
  },

  FAMILY_DUO: {
    id: 'FAMILY_DUO' as PlanType,
    name: 'Family Duo',
    description: '1 parent + 1 daughter',
    price: 2499,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: true,
      maxFamilyMembers: 1,
    },
  },

  FAMILY_PLUS: {
    id: 'FAMILY_PLUS' as PlanType,
    name: 'Family Plus',
    description: '1 parent + up to 3 daughters',
    price: 3499,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: true,
      maxFamilyMembers: 3,
    },
  },

  FAMILY_LEGACY: {
    id: 'FAMILY_LEGACY' as PlanType,
    name: 'Family Legacy',
    description: '2 parents + unlimited daughters',
    price: 4999,
    features: {
      dailyCheckIns: true,
      basicPhaseDetection: true,
      calendarSync: true,
      advancedInsights: true,
      autoReschedule: true,
      familyFeatures: true,
      maxFamilyMembers: 999,
    },
  },
} as const;

export type PlanConfig = typeof PLANS[keyof typeof PLANS];
export type PlanFeatures = PlanConfig['features'];
export type FeatureKey = keyof PlanFeatures;

export function getPlan(planType: PlanType): PlanConfig {
  return PLANS[planType] || PLANS.FREE;
}

export function getPlanFeatures(planType: PlanType): PlanFeatures {
  return getPlan(planType).features;
}

export function isPro(planType: PlanType): boolean {
  return planType !== 'FREE';
}

export function isFamilyPlan(planType: PlanType): boolean {
  return planType.startsWith('FAMILY_');
}

export function hasFeature(planType: PlanType, feature: FeatureKey): boolean {
  const value = getPlanFeatures(planType)[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return false;
}
