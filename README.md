# DoTree

DoTree is a minimalist Todo List application designed for focus and simplicity. It features a strict black-and-white aesthetic and supports nested tasks to help you organize complex projects.

## Features

- **Minimalist Design**: Distraction-free black and white UI.
- **Nested Tasks**: Break down main tasks into manageable subtasks.
- **Priority Management**: Simple priority indicators.
- **Local Storage**: Your data stays on your device.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native)
- **Language**: TypeScript
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React Native](https://lucide.dev)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npx expo start
```

You can then run the app on:
- **iOS**: Press `i` in the terminal (requires Xcode Simulator).
- **Android**: Press `a` in the terminal (requires Android Studio Emulator).
- **Web**: Press `w` in the terminal.

## Project Structure

- `src/`: Core application source code.
- `assets/`: Images and fonts.
- `app.json`: Expo configuration.
- `App.tsx`: Main entry point.

## Build & Release

This project uses **EAS Build** for creating native apps.

### Prerequisites

1. Install EAS CLI: `npm install -g eas-cli`
2. Login to your Expo account: `eas login`

### Development Build
Creates a standalone app that points to your local Metro server. Useful for native debugging.

```bash
eas build --platform android --profile development
```

### Preview Build (APK)
Creates a standalone APK that can be installed and run without a server. Useful for sharing or testing on device.

```bash
eas build --platform android --profile preview
```

### Production Build
Optimized build for store submission.

```bash
eas build --platform android --profile production
```
