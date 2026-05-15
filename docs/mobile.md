# Mobile App Setup

Familia Connect includes an Expo React Native app for Android and iOS in `apps/mobile`.

## Prerequisites

- Node.js 20
- Expo CLI through `npx expo`
- Android Studio for Android emulator/device builds
- Xcode on macOS for iOS simulator/device builds
- EAS CLI for cloud builds:

```bash
npm install -g eas-cli
```

## Install Dependencies

From the repository root:

```bash
npm install
```

## API URL Configuration

The mobile app reads:

```text
EXPO_PUBLIC_API_URL
```

For iOS simulator:

```text
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

For Android emulator:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api
```

For a physical phone, use your computer's LAN IP address:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.25:4000/api
```

The phone and development computer must be on the same network unless the API is deployed publicly.

## Run Locally

Start the backend:

```bash
docker compose up mongo api
```

Start Expo:

```bash
npm run dev:mobile
```

Then:

- Press `a` for Android
- Press `i` for iOS on macOS
- Scan the QR code with Expo Go for a physical device

You can also run:

```bash
npm run android
npm run ios
```

## Release Builds

Android:

```bash
npm run build:android --workspace apps/mobile
```

iOS:

```bash
npm run build:ios --workspace apps/mobile
```

Before production builds, update `apps/mobile/app.json`:

- `ios.bundleIdentifier`
- `android.package`
- `extra.eas.projectId`
- app icons and splash assets

## Current Mobile Features

- Login and signup
- Persisted JWT session
- Family tree list
- Create family trees
- View tree statistics
- View family members
- Add family members
- Pick profile photos from the native photo library
- Uses the same backend, database, auth, and upload API as the web app
