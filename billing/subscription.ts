
import { PlanType, SubscriptionStatus } from '../../types';
import { PLANS, getPlan, isPro, isFamilyPlan, PlanFeatures, hasFeature, FeatureKey } from './plans';
import { CURRENT_USER } from '../../services/mockData';

export interface UserSubscription {
  plan: PlanType;
  planName: string;
  status: SubscriptionStatus;
  features: PlanFeatures;
  isPro: boolean;
  isFamilyPlan: boolean;
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt: Date | undefined;
  trialDaysRemaining: number | null;
  hasUsedTrial: boolean;
  canStartTrial: boolean;
}

/**
 * Retrieves the current user's subscription status.
 * In a real app, this would fetch from an API/Database.
 */
export async function getUserSubscription(): Promise<UserSubscription> {
  const user = CURRENT_USER;
  
  const now = new Date();
  
  // Logic to determine if trial is expired
  let status = user.subscriptionStatus;
  let plan = user.plan;
  
  if (status === 'TRIALING' && user.trialEndsAt && now > user.trialEndsAt) {
    status = 'EXPIRED';
    plan = 'FREE';
  }

  const isActive = ['ACTIVE', 'TRIALING', 'LIFETIME'].includes(status);
  
  // If expired or canceled, fallback to free features logically, 
  // though we keep the record of what plan they *had* if we wanted to show "Renew Pro"
  // For this helper, we return the effective plan.
  const effectivePlan = isActive ? plan : 'FREE';
  const planConfig = getPlan(effectivePlan);

  // Calculate trial days
  let trialDaysRemaining: number | null = null;
  if (status === 'TRIALING' && user.trialEndsAt) {
    const msRemaining = user.trialEndsAt.getTime() - now.getTime();
    trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  }

  return {
    plan: effectivePlan,
    planName: planConfig.name,
    status: status,
    features: planConfig.features,
    isPro: isPro(effectivePlan),
    isFamilyPlan: isFamilyPlan(effectivePlan),
    isActive,
    isTrial: status === 'TRIALING',
    trialEndsAt: user.trialEndsAt,
    trialDaysRemaining,
    hasUsedTrial: user.hasUsedTrial,
    canStartTrial: !user.hasUsedTrial && !isPro(effectivePlan),
  };
}

/**
 * Checks if the current user has access to a specific feature.
 */
export async function canAccessFeature(feature: FeatureKey): Promise<boolean> {
  const sub = await getUserSubscription();
  return sub.features[feature] === true || (typeof sub.features[feature] === 'number' && (sub.features[feature] as number) > 0);
}

/**
 * Simulates starting a Pro trial.
 */
export async function startProTrial(): Promise<boolean> {
  if (CURRENT_USER.hasUsedTrial) return false;
  
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(now.getDate() + 14); // 14 Day trial

  CURRENT_USER.plan = 'PRO_MONTHLY';
  CURRENT_USER.subscriptionStatus = 'TRIALING';
  CURRENT_USER.trialEndsAt = trialEnd;
  CURRENT_USER.hasUsedTrial = true;
  
  return true;
}
