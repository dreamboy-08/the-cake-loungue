# Firebase Storage CORS Configuration Guide

The Admin Product Management system requires CORS to be configured on your Firebase Storage bucket to allow image uploads from the web frontend.

## Prerequisites

1.  [Google Cloud SDK (gsutil)](https://cloud.google.com/storage/docs/gsutil_install) installed and authenticated.
2.  Your Firebase Project ID (found in `src/utils/firebase.ts` or Firebase Console).

## Instructions

1.  Open your terminal in the root directory of this project.
2.  Authenticate with Google Cloud (if not already done):
    ```bash
    gcloud auth login
    ```
3.  Set your project:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```
4.  Apply the CORS configuration to your storage bucket:
    ```bash
    gsutil cors set storage-cors.json gs://YOUR_STORAGE_BUCKET
    ```
    *Note: Replace `YOUR_STORAGE_BUCKET` with your bucket name (e.g., `cake-lounge-xyz.appspot.com`).*

## Verification

After applying, you can verify the configuration with:
```bash
gsutil cors get gs://YOUR_STORAGE_BUCKET
```

## Why is this necessary?

By default, Firebase Storage blocks cross-origin requests (CORS) from web applications for security. Since the admin dashboard uploads files directly from the browser to Firebase Storage, explicit permission must be granted.
