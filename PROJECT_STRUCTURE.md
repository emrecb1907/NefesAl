# NefesAl Project Structure

## Complete File List

```
NefesAl/
├── App.tsx                          # Main app entry point
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel configuration with Reanimated & NativeWind
├── expo-env.d.ts                    # Expo TypeScript definitions
├── global.css                       # Tailwind CSS global styles
├── metro.config.js                  # Metro bundler config with NativeWind
├── package.json                     # Dependencies and scripts
├── README.md                        # Project documentation
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── .gitignore                       # Git ignore rules
│
├── src/
│   ├── assets/                      # Images, sounds, and other assets
│   │   └── .gitkeep
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── Button.tsx               # Button component with variants
│   │   ├── Card.tsx                 # Card container component
│   │   ├── GradientBackground.tsx   # Gradient background wrapper
│   │   └── index.ts                 # Component exports
│   │
│   ├── constants/                   # App constants
│   │   ├── ambiances.ts             # Ambient sound definitions
│   │   ├── breathingPatterns.ts     # Breathing pattern definitions
│   │   └── index.ts                 # Constant exports
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAmbientSound.ts       # Hook for ambient sound playback
│   │   ├── useLocalization.ts       # Hook for i18n/localization
│   │   └── index.ts                 # Hook exports
│   │
│   ├── navigation/                  # Navigation configuration
│   │   ├── RootNavigator.tsx        # Root navigation stack
│   │   ├── TabNavigator.tsx         # Bottom tab navigator
│   │   └── types.ts                 # Navigation type definitions
│   │
│   ├── screens/                     # Screen components
│   │   ├── Home.tsx                 # Home screen
│   │   ├── Sessions.tsx             # Sessions screen
│   │   ├── Stats.tsx                # Statistics screen
│   │   ├── Profile.tsx              # Profile screen
│   │   ├── Onboarding.tsx           # Onboarding screen
│   │   ├── Settings.tsx             # Settings screen
│   │   └── Premium.tsx              # Premium screen
│   │
│   ├── state/                       # State management
│   │   └── store.ts                 # Zustand store with persist
│   │
│   ├── styles/                      # Styling and themes
│   │   ├── colors.ts                # Theme hooks and utilities
│   │   └── themes.ts                # Light/dark theme definitions
│   │
│   └── utils/                       # Utility functions
│       ├── formatTime.ts            # Time formatting utilities
│       ├── haptics.ts               # Haptic feedback utilities
│       ├── notifications.ts         # Notification management
│       ├── storage.ts               # Storage wrapper utilities
│       └── index.ts                 # Utility exports
```

## Package Dependencies

### Core
- `expo` ~51.0.0
- `react` 18.2.0
- `react-native` 0.74.5

### Navigation
- `@react-navigation/native` ^6.1.9
- `@react-navigation/native-stack` ^6.9.17
- `@react-navigation/bottom-tabs` ^6.5.11
- `react-native-safe-area-context` 4.10.5

### State Management
- `zustand` ^4.5.2
- `@react-native-async-storage/async-storage` 1.23.1

### Animations & Gestures
- `react-native-reanimated` ~3.10.1
- `react-native-gesture-handler` ~2.16.1

### UI/Styling
- `nativewind` ^4.0.1
- `tailwindcss` ^3.4.1
- `expo-linear-gradient` ~13.0.2
- `expo-blur` ~13.0.1

### Media & System
- `expo-av` ~14.0.7
- `expo-haptics` ~13.0.1
- `expo-notifications` ~0.28.1
- `expo-localization` ~15.0.1

### Charts
- `react-native-svg` 15.2.0

## Key Features Implemented

✅ **Navigation System**
- Root stack navigator with conditional onboarding
- Bottom tab navigator for main app
- Modal screens for Settings and Premium

✅ **State Management**
- Zustand store with AsyncStorage persistence
- State for: premium status, onboarding, stats, preferences

✅ **Theme System**
- Light/dark theme support
- System theme detection
- Theme-aware components

✅ **Utilities**
- Notification management
- Haptic feedback
- Time formatting
- Storage wrapper
- Ambient sound hook
- Localization hook

✅ **App Initialization**
- Reanimated setup
- SafeAreaProvider
- GestureHandlerRootView
- Notification permissions
- Zustand state hydration

## Next Steps

1. Run `npm install` to install all dependencies
2. Add your actual screen implementations (existing screens are placeholders)
3. Add icons for tab navigation
4. Add actual sound files to `src/assets/`
5. Customize themes and colors as needed
6. Implement breathing exercise logic
7. Add charts using react-native-svg

