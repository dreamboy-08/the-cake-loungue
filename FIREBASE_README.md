# Firebase Integration Setup

This project uses Firebase for Authentication and Cloud Firestore.

## Prerequisites

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** with **Email/Password** and **Google** sign-in providers.
3. Enable **Cloud Firestore** in test mode or production mode (with appropriate rules).
4. Register a Web App in your Firebase project to get the configuration values.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Refer to `.env.example` for the template.

## Authentication Features

- **Login**: Email/Password and Google Sign-In.
- **Signup**: New user registration with name, email, and password.
- **Forgot Password**: Password reset email functionality.
- **Session Persistence**: Users stay logged in across browser sessions.
- **Logout**: Sign out functionality available in the Navbar.

## Firestore Data Structure

The following collections are used:

- `users`: Stores user profile information.
- `products`: Stores product details (seeded from `src/constants/products.ts`).
- `categories`: Stores product categories (seeded from `src/constants/navigation.ts`).
- `orders`: Stores customer orders.
- `reviews`: Stores product reviews.

### Seeding Data

You can use the `seedFirestore` function in `src/utils/seedFirestore.ts` to populate your Firestore instance with initial products and categories. Currently, this is a utility function that you can call from a temporary admin route or a useEffect in a protected page during initial setup.

## Troubleshooting: "Invalid API Key"

If you see a `Firebase: Error (auth/api-key-not-valid)` error:

1. **Environment Variables**: Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in your deployment environment (e.g., Vercel Project Settings > Environment Variables).
2. **Prefix**: In Next.js, client-side environment variables **must** start with `NEXT_PUBLIC_`.
3. **Re-deployment**: After adding environment variables in Vercel, you must trigger a new deployment for them to take effect.
4. **Local Testing**: Create a `.env.local` file for local development.

## Implementation Details

- **AuthContext**: Global authentication state managed via `src/context/AuthContext.tsx`.
- **Firebase Config**: Initialized in `src/utils/firebase.ts`.
- **UI Components**: Login, Signup, and Forgot Password pages are implemented in `src/app/` following the premium luxury design system.
