# Video Upload Solution

This document outlines an optimal solution for handling video uploads on the frontend, ensuring that the UI logic aligns with the upload logic and addresses various user interaction scenarios (such as canceling uploads or not entering metadata). It also proposes a rollback mechanism (deleting uploaded videos) on the backend and provides sample code for both frontend and backend implementations.

## 1. Analysis of Scenarios and Requirements

### Scenarios to Handle:

- **User does not continue upload after receiving presigned URL:**
  - The backend provides a presigned URL (with an expiration time, e.g., 1 hour).
  - If the user does not upload, the presigned URL will naturally expire, and no data will be sent to S3.
  - **Requirement:** No special handling is needed, but users should be notified if the URL expires when they attempt to upload later.

- **User cancels upload mid-process:**
  - The user starts uploading a file (single or multipart) but closes the browser, cancels the upload, or encounters an error (e.g., network loss).
  - **Requirements:**
    - For single uploads: If the upload is incomplete, no object is saved on S3 (as PutObject is atomic).
    - For multipart uploads: Uploaded parts will temporarily exist on S3, requiring cancellation of the multipart upload to avoid wasted storage.
    - A mechanism is needed for the frontend to notify the backend to cancel the upload or automatically clean up.

- **User completes upload but does not enter metadata:**
  - The video is successfully uploaded to S3 (with a key).
  - The user does not enter metadata (e.g., title, description) and exits the interface.
  - **Requirement (as per your input):** Do not save drafts; rollback by deleting the video on S3.
  - **Challenge:** Determine when the user "skips" entering metadata and safely delete the object on S3.

### General Requirements:

- **UI Logic:** The interface must be intuitive, display upload status (progress, errors, success), allow upload cancellation, and guide users to enter metadata.
- **Rollback Handling:** The backend must handle object deletion on S3 when uploads are canceled or metadata is not provided.
- **Security:** Use accessToken in HttpOnly cookies (as discussed) for request authentication, instead of idToken.
- **Performance:** Optimize user experience (UX) with a progress bar, retry logic, and clear error messages.

### Assumptions:

- You are using AWS S3 with presigned URLs for single and multipart uploads.
- The backend is configured to return presigned URL(s) and handle multipart upload completion.
- The frontend uses React and libraries like axios, @tanstack/react-query.
- Do not save drafts; delete the video if the user does not complete the metadata entry step.

## 2. Proposed Solution

### Solution Overview:

#### UI Interface:

- Use a wizard-like flow (step-by-step interface):
  - **Step 1:** Select and upload file (dropzone, progress bar, cancel button).
  - **Step 2:** Enter metadata (title, description, tags, etc.).
  - **Step 3:** Confirm and save video.
- Display loading status, upload progress, and error/success messages.
- Allow upload cancellation at any step, with user confirmation.

#### Upload Logic:

- Start uploading immediately after receiving presigned URL(s) (to avoid URL expiration).
- For multipart uploads, temporarily save state (e.g., uploadId, key) to support cancellation.
- Add retry logic for failed upload parts.

#### Handling Cancellation and Rollback:

- If the user cancels the upload (single or multipart), call an API to delete the object or cancel the multipart upload.
- If the user does not enter metadata, call an API to delete the object on S3.
- The backend handles deletion/cancellation tasks to ensure safety and security.

#### Security:

- Use HttpOnly cookies for accessToken.
- The backend verifies the accessToken and retrieves user information (including userId) from the auth-service.

### Detailed Flow:

- **Select File and Obtain Presigned URL:**
  - User selects a file → Frontend sends a request to `/upload/presigned-url` → Backend returns presigned URL(s).

- **Upload File:**
  - Single upload: Send PUT to presigned URL.
  - Multipart upload: Send multiple PUTs to presigned URLs, collect ETag → Call `/upload/complete-multipart`.

- **Enter Metadata:**
  - After successful upload, transition to the metadata entry interface.
  - Temporarily save the key (S3 object key) for rollback use if needed.

- **Handle Cancellation or Errors:**
  - Cancel upload: Call API `/upload/abort` (for multipart) or `/upload/delete` (for single).
  - No metadata entry: Call API `/upload/delete` to delete the object.

- **Save Video:**
  - If metadata is valid, send a request to `/videos` to save metadata and complete the process.