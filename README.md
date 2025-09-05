## WorklyHRMStable — React Native HRM App

A Human Resource Management mobile app built with React Native. It focuses on daily HR workflows such as attendance, leave requests, and realtime notifications.

### Key Features
- **Authentication**: JWT-based, persisted via `redux-persist`.
- **Push Notifications (FCM)**: Foreground, background, and quit-state handling; deep navigate to `Notification` screen.
- **FCM Token Sync**: Save token locally and update to backend upon login.
- **Navigation**: `@react-navigation` stack and bottom tabs with proper gesture handling.
- **State Management**: `@reduxjs/toolkit` + `react-redux` with offline persistence.
- **Geolocation**: `react-native-geolocation-service` for location-based features.

### Tech Stack
- React Native 0.76, React 18
- Redux Toolkit, redux-persist
- React Navigation (native-stack, bottom-tabs)
- Firebase (Messaging), `@react-native-firebase/*`
- Axios, jwt-decode

### Project Structure (high-level)
```
src/
  navigation/       # RootNavigator, NavigationService
  redux/            # store, slices, persist config
  services/         # ApiService, network layer
  hooks/            # custom hooks (e.g., permissions)
  utils/            # token utils, helpers
  screens/          # app screens
```

### Setup
1) Prerequisites: Node >= 18, Android Studio and/or Xcode, React Native environment per official docs.
2) Install deps:
```bash
npm install
```
3) Configure environment:
- Firebase project with Cloud Messaging enabled.
- Native setup for push notifications (Android/iOS) and required permissions.
- Backend API base URL and endpoints configured in `src/services/ApiService`.

### Run
```bash
# Start Metro
npm start

# Android
npm run android


### Permissions
- Notifications (required for FCM)
- Location (requested at startup by `useStartupPermissions`)

### Notifications Flow (overview)
1) Request notification permission at app launch.
2) Retrieve and store FCM token; sync to backend when authenticated.
3) Handle notifications in foreground (toast + tap → `Notification`), background, and cold start (navigate accordingly).


### License
Proprietary/Private (update as needed).
