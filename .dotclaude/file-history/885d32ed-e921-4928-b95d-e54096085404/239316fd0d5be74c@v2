# Firebase Integration Guide

This document outlines the steps needed to integrate Firebase with the Global Nadars Matrimony application.

## Prerequisites

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Install Firebase SDK: `npm install firebase`

## Firebase Services Required

### 1. Authentication
- **Email/Password Authentication**: For user registration and login
- **Phone Authentication**: Optional, for mobile number verification
- **Setup Steps**:
  - Go to Firebase Console → Authentication
  - Enable Email/Password sign-in method
  - (Optional) Enable Phone sign-in method

### 2. Firestore Database
- **Collections Needed**:
  - `users` - Store user profiles
  - `contacts` - Store contact form submissions
  - `matches` - Store match suggestions
  - `interests` - Store user interests/connections

- **Setup Steps**:
  - Go to Firebase Console → Firestore Database
  - Create database in production mode
  - Set up security rules (see below)

### 3. Storage
- **Buckets Needed**:
  - Profile pictures
  - Gallery images
  - Document uploads (optional)

- **Setup Steps**:
  - Go to Firebase Console → Storage
  - Create default bucket
  - Set up security rules (see below)

## Configuration

1. Copy your Firebase config from Firebase Console → Project Settings
2. Update `/src/lib/firebase.ts` with your configuration:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Uncomment the Firebase initialization code in `/src/lib/firebase.ts`

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Contacts collection
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Matches collection
    match /matches/{matchId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile_pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Extended Registration Form Fields

After Firebase integration, the registration form will include:

### Personal Information
- Height, Weight
- Marital Status
- Physical Status

### Education & Career
- Education Level
- Education Details
- Occupation
- Occupation Details
- Annual Income

### Family Details
- Father's Name & Occupation
- Mother's Name & Occupation
- Number of Siblings
- Family Type (Nuclear/Joint)
- Family Status

### Location
- Country, State, City
- Residency Status

### About & Preferences
- About yourself
- Hobbies & Interests
- Partner Preferences (age, height, education, occupation, location)

## Next Steps

1. Provide your Firebase configuration
2. Install Firebase: `npm install firebase`
3. Implement authentication logic in `/src/app/login/page.tsx` and `/src/app/register/page.tsx`
4. Create extended registration form
5. Implement profile management
6. Add search and filter functionality
7. Implement match suggestions
8. Add messaging/interest system

## Files Structure

```
src/
├── lib/
│   └── firebase.ts          # Firebase configuration
├── types/
│   └── index.ts             # TypeScript interfaces
├── app/
│   ├── login/
│   │   └── page.tsx         # Login page (ready for Firebase)
│   ├── register/
│   │   └── page.tsx         # Registration page (ready for Firebase)
│   └── ...
└── components/
    └── ...
```
