export interface Ambiance {
  id: string;
  name: string;
  description: string;
  soundFile?: number; // require() returns a number (asset ID)
  imageFile?: number; // require() returns a number (asset ID)
  miniImageFile?: number; // require() returns a number (asset ID) - for sound card icons
  color: string;
  isPremium?: boolean;
  icon: 'rain' | 'forest' | 'ocean' | 'cosmic' | 'zen' | 'fire';
}

export const ambiances: Ambiance[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soothing droplets for calm',
    soundFile: require('../assets/atmospherSounds/gentleRain.m4a'),
    imageFile: require('../assets/atmospherImages/rainandthunder.webp'),
    miniImageFile: require('../assets/atmospherMini/rainandthunderMini.webp'),
    color: '#2D3E50',
    isPremium: false,
    icon: 'rain',
  },
  {
    id: 'rainAndThunderAtHome',
    name: 'Rain & Thunder at Home',
    description: 'Cozy indoor storm sounds',
    soundFile: require('../assets/atmospherSounds/rainAndThunderAtHome.m4a'),
    imageFile: require('../assets/atmospherImages/rainAndThunderAtHome.webp'),
    miniImageFile: require('../assets/atmospherMini/rainAndThunderAtHomeMini.webp'),
    color: '#2D3E50',
    isPremium: false,
    icon: 'rain',
  },
  {
    id: 'winterStorm',
    name: 'Winter Storm',
    description: 'Intense winter weather sounds',
    soundFile: require('../assets/atmospherSounds/winterStorm.m4a'),
    imageFile: require('../assets/atmospherImages/winterStorm.webp'),
    miniImageFile: require('../assets/atmospherMini/winterStormMini.webp'),
    color: '#2D3E50',
    isPremium: false,
    icon: 'rain',
  },
  {
    id: 'forest',
    name: 'Forrest',
    description: "Nature's melody for focus",
    soundFile: require('../assets/atmospherSounds/forrest.m4a'),
    imageFile: require('../assets/atmospherImages/forrest.webp'),
    miniImageFile: require('../assets/atmospherMini/forrestMini.webp'),
    color: '#2D5016',
    isPremium: false,
    icon: 'forest',
  },
  {
    id: 'rainAtForrest',
    name: 'Rain at Forrest',
    description: 'Peaceful rain in the forest',
    soundFile: require('../assets/atmospherSounds/rainAtForrest.m4a'),
    imageFile: require('../assets/atmospherImages/rainAtForrest.webp'),
    miniImageFile: require('../assets/atmospherMini/rainAtForrestMini.webp'),
    color: '#2D5016',
    isPremium: false,
    icon: 'rain',
  },
  {
    id: 'creek',
    name: 'Creek',
    description: 'Gentle flowing water sounds',
    soundFile: require('../assets/atmospherSounds/creekSound.m4a'),
    imageFile: require('../assets/atmospherImages/creek.webp'),
    miniImageFile: require('../assets/atmospherMini/creekMini.webp'),
    color: '#1A4D6D',
    isPremium: false,
    icon: 'forest',
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'Powerful cascading water',
    soundFile: require('../assets/atmospherSounds/waterfallSound.m4a'),
    imageFile: require('../assets/atmospherImages/waterfall.webp'),
    miniImageFile: require('../assets/atmospherMini/waterfallMini.webp'),
    color: '#1A4D6D',
    isPremium: false,
    icon: 'ocean',
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
    name: 'Fireplace',
    description: 'Warm, comforting hearth sounds',
    soundFile: require('../assets/atmospherSounds/firePlace.m4a'),
    imageFile: require('../assets/atmospherImages/fire.webp'),
    miniImageFile: require('../assets/atmospherMini/fireMini.webp'),
    color: '#8B4513',
    isPremium: false,
    icon: 'fire',
  },
];

