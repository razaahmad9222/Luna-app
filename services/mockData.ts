
import { User, CyclePhase, Event, EventType, Suggestion, FamilyMember, PlanType, WeatherData, BioWeatherInsight } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Elena Fisher',
  email: 'elena@luna.app',
  accountType: 'PARENT',
  
  // Subscription Mock Data
  plan: 'FREE',
  subscriptionStatus: 'FREE',
  hasUsedTrial: false,
  
  onboardingComplete: false,
  onboardingStep: 2,
  phase: CyclePhase.LUTEAL,
};

export const updateUserSubscription = (plan: PlanType) => {
  CURRENT_USER.plan = plan;
  CURRENT_USER.subscriptionStatus = 'ACTIVE';
  
  // Reset trial if they buy immediately
  if (plan !== 'FREE') {
      CURRENT_USER.trialEndsAt = undefined;
  }

  console.log(`[Luna API] User subscription updated to: ${plan}`);
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Q3 Strategy Review',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)),
    eventType: EventType.HIGH_STAKES,
    fitScore: 85,
  },
  {
    id: 'e2',
    title: 'Team Sync',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)),
    eventType: EventType.COLLABORATIVE,
    fitScore: 92,
  },
  {
    id: 'e3',
    title: 'HIIT Workout',
    startTime: new Date(new Date().setHours(17, 30, 0, 0)),
    endTime: new Date(new Date().setHours(18, 30, 0, 0)),
    eventType: EventType.INTENSE_WORKOUT,
    fitScore: 60, // Maybe not great for current phase
  },
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    type: 'RESCHEDULE',
    title: 'Reschedule HIIT Workout',
    body: 'Your energy is naturally lower today during the Luteal phase. Consider a lighter activity.',
    reason: 'Energy Conservation',
  },
  {
    id: 's2',
    type: 'PREPARE',
    title: 'Prepare for Q3 Strategy',
    body: 'You are in a phase great for detail, but watch out for brain fog. Take notes early.',
    reason: 'Cognitive Optimization',
  },
];

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'f1',
    name: 'Sophie',
    relationship: 'Daughter',
    phase: CyclePhase.MENSTRUAL,
    statusMessage: 'Cramps 😫',
    lastCheckIn: new Date(),
    avatarUrl: 'https://picsum.photos/100/100',
  },
];

/**
 * Intelligent Engine for Bio-Weather Recommendations.
 * Combines Cycle Phase + Weather Data to give specific advice.
 */
export const generateBioWeatherInsight = (phase: CyclePhase, weather: WeatherData): BioWeatherInsight => {
  const isCold = weather.temperature < 15; // Celsius
  const isHot = weather.temperature > 25;
  const isRainy = weather.weatherCode >= 51;

  let wardrobe = {
    summary: 'Standard Professional',
    details: 'Wear what makes you feel confident.',
    outfitTags: ['Professional', 'Comfort'],
  };

  let nutrition = {
    focus: 'Balanced Energy',
    details: 'Focus on whole foods and hydration.',
    powerIngredients: ['Water', 'Greens'],
  };

  // --- Wardrobe Logic ---
  switch (phase) {
    case CyclePhase.MENSTRUAL:
      wardrobe.summary = 'Maximum Comfort Structure';
      wardrobe.details = isCold 
        ? 'Core temperature is dropping. Opt for warm, non-restrictive layers like cashmere wraps or high-waisted trousers with stretch.' 
        : 'Bloating is likely. Choose A-line silhouettes or untucked structured shirts to maintain polish without constriction.';
      wardrobe.outfitTags = ['Elastic Waist', 'Soft Fabrics', 'Dark Colors'];
      break;

    case CyclePhase.FOLLICULAR:
      wardrobe.summary = 'Creative & Bold';
      wardrobe.details = 'Estrogen is rising, boosting skin glow. It’s a great time for bolder colors or experimenting with new accessories.';
      wardrobe.outfitTags = ['Statement Piece', 'Lighter Fabrics', 'Bold Colors'];
      break;

    case CyclePhase.OVULATORY:
      wardrobe.summary = 'Power Dressing';
      wardrobe.details = isHot
        ? 'You are at peak body temperature and magnetism. Wear breathable silks or sleeveless cuts that highlight your high energy.'
        : 'Confidence is at an all-time high. Fitted silhouettes and high heels will feel effortless today.';
      wardrobe.outfitTags = ['Fitted', 'Heels', 'Silk'];
      break;

    case CyclePhase.LUTEAL:
      wardrobe.summary = 'Temperature Regulation';
      wardrobe.details = isHot
        ? 'Basal body temperature is elevated (~0.5°C). Avoid synthetic blends; stick to linen or breathable cotton to prevent overheating.'
        : 'You may feel sensitive to sensory input. Choose soft textures against the skin and avoid heavy, scratchy wools.';
      wardrobe.outfitTags = ['Breathable', 'Layers', 'Comfort Shoes'];
      break;
  }

  // --- Nutrition Logic ---
  switch (phase) {
    case CyclePhase.MENSTRUAL:
      nutrition.focus = 'Replenish & Warm';
      nutrition.details = 'Focus on iron-rich foods to replenish blood loss and warm, cooked meals for easier digestion.';
      nutrition.powerIngredients = ['Steak', 'Lentils', 'Dark Chocolate'];
      break;

    case CyclePhase.FOLLICULAR:
      nutrition.focus = 'Fresh & Light';
      nutrition.details = 'Energy is building. Your metabolism handles carbs well right now. Opt for fresh salads and ancient grains.';
      nutrition.powerIngredients = ['Quinoa', 'Citrus', 'Avocado'];
      break;

    case CyclePhase.OVULATORY:
      nutrition.focus = 'Sustain High Energy';
      nutrition.details = 'You are burning energy fast. Hydration is critical. Eat cooling foods like cucumber and berries.';
      nutrition.powerIngredients = ['Berries', 'Cucumber', 'Salmon'];
      break;

    case CyclePhase.LUTEAL:
      nutrition.focus = 'Stabilize Blood Sugar';
      nutrition.details = 'Progesterone increases appetite. Combat cravings and the afternoon crash with complex carbs and root vegetables.';
      nutrition.powerIngredients = ['Sweet Potato', 'Walnuts', 'Brown Rice'];
      break;
  }

  return { wardrobe, nutrition };
};
