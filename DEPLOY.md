# Deploying RestDock to Vercel

Since your code is already hosted on GitHub, deploying to Vercel is extremely easy and recommended.

## Option 1: Vercel Dashboard (Recommended)

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project**:
    *   Click the **"Add New..."** button and select **"Project"**.
    *   Select **"Import Git Repository"**.
3.  **Import Repository**:
    *   Find `anishtr4/restdock_release` in the list (you may need to install the Vercel GitHub App if you haven't already).
    *   Click **"Import"**.
4.  **Configure Project**:
    *   **Framework Preset**: Select **"Other"** (since this is a static HTML/CSS site).
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: Leave empty.
    *   **Output Directory**: Leave empty (Vercel automatically serves the root files).
5.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait ~10 seconds. Vercel will build and assign a URL (e.g., `restdock-release.vercel.app`).

## Option 2: Automatic Updates

Once connected, every time you `git push` to the `main` branch, Vercel will automatically redeploy your changes instantly.

---

**Note**: Ensure your `index.html`, `styles.css`, and assets (`app-screenshot-v3.png`, `restdock-logo.png`) are in the root directory, which they currently are.
