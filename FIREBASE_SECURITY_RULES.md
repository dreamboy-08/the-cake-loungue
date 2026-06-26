# Firebase Security Rules & Configuration

To ensure the Admin Product Management system works correctly and securely, the following rules and configurations must be applied in the Firebase Console.

## 1. Cloud Firestore Rules

These rules allow anyone to read products and categories, but restrict write access to authenticated admin users.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Products Collection
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Categories Collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Users Collection
    match /users/{userId} {
      // Users can only read/write their own data
      // Admins can read all user data and update roles
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        (request.auth.uid == userId && request.resource.data.role == resource.data.role) ||
        isAdmin()
      );
    }

    // Orders (Customers can create/read their own, Admins can do everything)
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow update, delete: if isAdmin();
    }
  }
}
```

## 2. Firebase Storage Rules

These rules allow public viewing of product images while restricting uploads to admin users.

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                     firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 3. Storage CORS Configuration

Direct browser-based uploads to Firebase Storage will fail unless CORS is configured. See `storage-cors.json` and `STORAGE_CORS_GUIDE.md` in the root directory for instructions on how to apply these settings using `gsutil`.

## 4. Environment Variables

Ensure the following are set in your production environment (Vercel):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_API_URL` (Points to your backend server)
