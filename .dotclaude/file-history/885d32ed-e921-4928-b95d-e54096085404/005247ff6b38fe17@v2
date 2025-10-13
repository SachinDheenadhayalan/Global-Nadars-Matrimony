# Updated Firestore Security Rules

Add this rule to your existing Firestore rules to support the registration system:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to create and manage their own user document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }

    // Your existing rules below:

    // Allow authenticated users to read all profiles
    match /profiles/{profileId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == profileId;
    }

    // Allow users to manage their own interests
    match /interests/{interestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.senderId == request.auth.uid ||
         resource.data.receiverId == request.auth.uid);
    }

    // Allow users to access their own chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
    }

    // Allow users to access messages in their chats
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Explanation

The new `users` rule allows:
- **Read**: Any authenticated user can read user profiles
- **Create**: Any authenticated user can create their user document (needed for registration)
- **Update/Delete**: Only the owner can update or delete their own user document

This works alongside your existing rules for profiles, interests, and chats.

## Alternative: Using Profiles Collection

If you prefer to use your existing `profiles` collection instead of `users`, I can update the registration page to store data there instead. Just let me know!
