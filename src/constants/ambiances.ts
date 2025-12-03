export interface Ambiance {
  id: string;
  name: string;
  description: string;
  soundFile?: number; // require() returns a number (asset ID)
  imageFile?: number; // require() returns a number (asset ID)
  color: string;
  isPremium?: boolean;
  icon: 'rain' | 'forest' | 'ocean' | 'cosmic' | 'zen' | 'fire';
}

export const ambiances: Ambiance[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soothing droplets for calm',
    soundFile: require('../assets/atmospherSounds/rainandthunder.wav'),
    imageFile: require('../assets/atmospherImages/rainandthunder.webp'),
    color: '#2D3E50',
    isPremium: false,
    icon: 'rain',
  },
  {
    id: 'forest',
    name: 'Forest Stream',
    description: "Nature's melody for focus",
    color: '#2D5016',
    isPremium: false,
    icon: 'forest',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Rhythmic waves for deep relaxation',
    color: '#1A4D6D',
    isPremium: false,
    icon: 'ocean',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Hum',
    description: 'Ethereal tones for transcendence',
    color: '#1A1A2E',
    isPremium: true,
    icon: 'cosmic',
  },
  {
    id: 'zen',
    name: 'Zen Garden',
    description: 'Subtle chimes and wind',
    color: '#3D4F3D',
    isPremium: true,
    icon: 'zen',
  },
  {
    id: 'fire',
    name: 'Fire Crackle',
    description: 'Warm, comforting hearth sounds',
    soundFile: require('../assets/atmospherSounds/fire.wav'),
    imageFile: require('../assets/atmospherImages/fire.webp'),
    color: '#8B4513',
    isPremium: false,
    icon: 'fire',
  },
];

