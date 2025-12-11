import { CyclePhase, EventType } from './types';

export const PHASE_CONFIG: Record<CyclePhase, {
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  recommendations: string[];
}> = {
  [CyclePhase.MENSTRUAL]: {
    name: 'Menstrual',
    emoji: '🌙',
    color: '#be123c',
    bgColor: 'bg-rose-500',
    description: 'Rest and reflect phase',
    recommendations: [
      'Light movement like yoga',
      'Reflective work',
      'Self-care and rest',
    ],
  },
  [CyclePhase.FOLLICULAR]: {
    name: 'Follicular',
    emoji: '🌱',
    color: '#059669',
    bgColor: 'bg-emerald-500',
    description: 'Rising energy phase',
    recommendations: [
      'Start new projects',
      'Brainstorming sessions',
      'Learning new skills',
    ],
  },
  [CyclePhase.OVULATORY]: {
    name: 'Ovulatory',
    emoji: '☀️',
    color: '#2563eb',
    bgColor: 'bg-blue-500',
    description: 'Peak energy phase',
    recommendations: [
      'Important presentations',
      'Negotiations and pitches',
      'High-intensity workouts',
    ],
  },
  [CyclePhase.LUTEAL]: {
    name: 'Luteal',
    emoji: '🍂',
    color: '#d97706',
    bgColor: 'bg-amber-500',
    description: 'Winding down phase',
    recommendations: [
      'Detail-oriented tasks',
      'Organizing and admin',
      'Gentle exercise',
    ],
  },
};

export const EVENT_TYPE_CONFIG: Record<EventType, {
  label: string;
  emoji: string;
}> = {
  [EventType.DEEP_FOCUS]: { label: 'Deep Focus', emoji: '🎯' },
  [EventType.PRESENTING]: { label: 'Presenting', emoji: '🎤' },
  [EventType.COLLABORATIVE]: { label: 'Collaborative', emoji: '👥' },
  [EventType.HIGH_STAKES]: { label: 'High Stakes', emoji: '⭐' },
  [EventType.ADMIN_LIGHT]: { label: 'Admin/Light', emoji: '📋' },
  [EventType.INTENSE_WORKOUT]: { label: 'Intense Workout', emoji: '🏋️' },
  [EventType.LIGHT_MOVEMENT]: { label: 'Light Movement', emoji: '🧘' },
  [EventType.SOCIAL]: { label: 'Social', emoji: '🎉' },
  [EventType.REST]: { label: 'Rest', emoji: '😴' },
  [EventType.OTHER]: { label: 'Other', emoji: '📌' },
};

export const FAMILY_ALERT_TYPES = {
  JUST_SAYING_HI: {
    label: 'Just saying hi',
    icon: '👋',
  },
  HAVE_GOOD_DAY: {
    label: 'Have a good day',
    icon: '🌟',
  },
};