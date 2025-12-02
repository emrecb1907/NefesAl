# NefesAl - Breathing & Meditation App

A beautiful breathing and meditation app built with Expo, React Native, and TypeScript.

## Features

- 🧘 Breathing exercises and guided sessions
- 📊 Track your progress and statistics
- 🎵 Ambient sounds for relaxation
- 🌙 Dark/Light theme support
- 📱 Cross-platform (iOS, Android, Web)
- 💾 Persistent state management with Zustand
- 🔔 Notification reminders
- 🎨 Beautiful UI with NativeWind (Tailwind)

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation system
- **Zustand** - State management with persistence
- **React Native Reanimated** - Smooth animations
- **NativeWind** - Tailwind CSS for React Native
- **Expo AV** - Audio playback
- **Expo Notifications** - Push notifications
- **Expo Localization** - Internationalization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Project Structure

```
src/
├── assets/          # Images, sounds, and other assets
├── components/      # Reusable UI components
├── constants/       # App constants and configurations
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── state/           # Zustand stores
├── styles/          # Theme and styling
└── utils/           # Utility functions
```

## State Management

The app uses Zustand for state management with AsyncStorage persistence. Key state includes:

- `isPremium` - Premium subscription status
- `onboardingCompleted` - Onboarding completion status
- `streak` - Current streak count
- `totalSessions` - Total sessions completed
- `totalMinutes` - Total minutes meditated
- `defaultAmbiance` - Default ambient sound
- `selectedTheme` - Theme preference (light/dark/system)

## License

MIT

