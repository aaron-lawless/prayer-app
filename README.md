# Prayer App

A cross-platform mobile app for managing prayer requests, contacts, and daily prayer activity. Built with React Native, Expo, Gluestack-ui, and NativeWind

## Features

- Add, edit, and delete contacts
- Create and manage prayer requests linked to contacts
- Mark prayers as answered
- Prayer Reel: swipe through unanswered prayers
- Daily activity tracking (unviewed prayers)
- Quick actions for adding contacts and prayers
- Recent prayers overview
- Local device storage (no cloud sync)
-  UI with NativeWind and custom components

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- Yarn or npm
- Android Studio or Xcode for device emulation (optional)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd my-app
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   expo start
   ```
4. Run on your device:
   - Scan the QR code with Expo Go (iOS/Android)
   - Or use an emulator: `expo run:android` or `expo run:ios`

## Project Structure

```
my-app/
├── app/                # App screens and navigation
├── components/         # UI components
├── context/            # React Context providers (Data, Theme)
├── assets/             # Images, GIFs, etc.
├── types/              # TypeScript types
├── package.json        # Project config
├── README.md           # This file
└── ...
```

## Local Storage
- All data is stored locally on the device using AsyncStorage.
- No cloud sync or remote database required. (future enhacement)

