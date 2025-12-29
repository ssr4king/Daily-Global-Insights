// API configuration
// For GitHub Pages, this should point to your Netlify function URL
// For Netlify deployment, leave empty to use relative paths
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Helper function to build API URLs
export function getApiUrl(path: string): string {
  if (API_BASE_URL) {
    // Remove leading slash from path if API_BASE_URL is set
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  return path;
}

