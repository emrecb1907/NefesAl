export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale: number;
}

export interface BreathingPatternWithMeta extends BreathingPattern {
  category?: string;
  isPremium?: boolean;
  patternDisplay?: string;
}

export const breathingPatterns: BreathingPatternWithMeta[] = [
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Deep relaxation · 4-7-8 rhythm',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfterExhale: 0,
    patternDisplay: '4-7-8',
    isPremium: false,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Focus & balance · 4-4-4-4',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    patternDisplay: '4-4-4-4',
    isPremium: false,
  },
  {
    id: 'relax',
    name: 'Relax Breathing',
    description: 'Calming pattern · 4-4-6',
    inhale: 4,
    hold: 4,
    exhale: 6,
    holdAfterExhale: 0,
    patternDisplay: '4-4-6',
    isPremium: false,
  },
  {
    id: 'calm',
    name: 'Calm Breathing',
    description: 'Gentle rhythm · 3-3-3',
    inhale: 3,
    hold: 3,
    exhale: 3,
    holdAfterExhale: 0,
    patternDisplay: '3-3-3',
    isPremium: false,
  },
  {
    id: 'focus',
    name: 'Focus Breathing',
    description: 'Clarity & attention · 5-5-5',
    inhale: 5,
    hold: 5,
    exhale: 5,
    holdAfterExhale: 0,
    patternDisplay: '5-5-5',
    isPremium: false,
  },
  {
    id: 'sleep',
    name: 'Sleep Breathing',
    description: 'Slow soothing · 4-7-8 (slow mode)',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfterExhale: 0,
    patternDisplay: '4-7-8',
    isPremium: true,
  },
];

