// ============================================================================
// Giphy API Configuration - Axios Instance
// ============================================================================
// This file creates and exports a pre-configured Axios HTTP client specifically
// for making requests to the GIPHY API. This is a common pattern in React
// applications for organizing API calls.
//
// WHY CREATE A CUSTOM AXIOS INSTANCE?
// Instead of using axios directly in every action/component, we create a
// configured instance with:
// - Base URL (so we don't repeat it in every request)
// - Default parameters (API key, language)
// - Default headers (if needed)
// - Interceptors for request/response (if needed)
// - Timeout settings (if needed)
//
// BENEFITS OF THIS APPROACH:
// ✅ DRY (Don't Repeat Yourself) - Configuration in one place
// ✅ Consistency - All requests use same settings
// ✅ Maintainability - Change API key or URL in one place
// ✅ Testability - Easy to mock this module in tests
// ✅ Scalability - Add interceptors, error handling centrally
// ✅ Security - Environment variables protect sensitive data
//
// LEARNING CONCEPTS:
// - Axios Instance Creation
// - Base URL Configuration
// - Default Parameters
// - Environment Variables
// - import.meta.env (Vite-specific)
// - API Key Management
// - Module Exports
// - HTTP Client Configuration
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * Import axios - The HTTP client library
 * 
 * WHAT IS AXIOS?
 * Axios is a promise-based HTTP client for the browser and Node.js.
 * It's the most popular alternative to the native fetch API.
 * 
 * WHY AXIOS OVER FETCH?
 * ✅ Automatic JSON transformation (no .json() call needed)
 * ✅ Request/response interceptors
 * ✅ Request cancellation (AbortController)
 * ✅ Better error handling
 * ✅ Progress tracking for uploads/downloads
 * ✅ Timeout support
 * ✅ CSRF protection
 * ✅ Works in older browsers
 * 
 * FETCH EXAMPLE (more verbose):
 * const response = await fetch(url);
 * if (!response.ok) throw new Error('Failed');
 * const data = await response.json();
 * 
 * AXIOS EXAMPLE (cleaner):
 * const { data } = await axios.get(url);
 * 
 * INSTALLATION:
 * npm install axios
 * or
 * yarn add axios
 * 
 * TYPESCRIPT:
 * Axios includes TypeScript definitions by default
 * No need for @types/axios
 */
import axios from "axios";

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

/**
 * giphyApi - Pre-configured Axios instance for GIPHY API
 * 
 * AXIOS.CREATE() METHOD:
 * Creates a new instance of axios with custom configuration.
 * This instance is independent from the default axios instance.
 * 
 * SYNTAX:
 * axios.create(config)
 *   ↑       ↑      ↑
 *   |       |      └─ Configuration object
 *   |       └──────── Method to create instance
 *   └──────────────── Axios library
 * 
 * WHAT GETS CREATED:
 * A function that works like axios, but with pre-configured defaults.
 * All requests made with this instance inherit these settings.
 * 
 * USAGE IN OTHER FILES:
 * import { giphyApi } from './api/giphy.api';
 * 
 * const response = await giphyApi.get('/search', { params: { q: 'cat' } });
 * // Full URL: https://api.giphy.com/v1/gifs/search?q=cat&lang=es&api_key=XXX
 * 
 * const response2 = await giphyApi('/trending');
 * // Full URL: https://api.giphy.com/v1/gifs/trending?lang=es&api_key=XXX
 */
export const giphyApi = axios.create({

    // ========================================================================
    // BASE URL CONFIGURATION
    // ========================================================================
    /**
     * baseURL - The base URL for all requests
     * 
     * WHAT IT DOES:
     * Automatically prepends this URL to all requests made with this instance.
     * 
     * EXAMPLE USAGE:
     * giphyApi.get('/search')  
     * // Becomes: GET https://api.giphy.com/v1/gifs/search
     * 
     * giphyApi.get('/trending')
     * // Becomes: GET https://api.giphy.com/v1/gifs/trending
     * 
     * giphyApi('/random')
     * // Becomes: GET https://api.giphy.com/v1/gifs/random
     * 
     * WHY THIS IS USEFUL:
     * Without baseURL, every request would need the full URL:
     * ❌ axios.get('https://api.giphy.com/v1/gifs/search')
     * ❌ axios.get('https://api.giphy.com/v1/gifs/trending')
     * 
     * With baseURL:
     * ✅ giphyApi.get('/search')
     * ✅ giphyApi.get('/trending')
     * 
     * BENEFITS:
     * ✅ Less repetition (DRY principle)
     * ✅ Easy to change API version (v1 → v2)
     * ✅ Easy to switch environments (dev, staging, prod)
     * ✅ Cleaner code in action files
     * 
     * ENVIRONMENT-SPECIFIC URLS:
     * Could be made dynamic:
     * baseURL: import.meta.env.VITE_API_BASE_URL
     * 
     * Then in .env:
     * VITE_API_BASE_URL=https://api.giphy.com/v1/gifs
     * 
     * GIPHY API STRUCTURE:
     * https://api.giphy.com/v1/gifs/
     *   ↑         ↑          ↑   ↑
     *   |         |          |   └─ Resource type (gifs, stickers, etc.)
     *   |         |          └───── API version
     *   |         └──────────────── Domain
     *   └────────────────────────── Protocol
     * 
     * Available endpoints:
     * - /search     - Search GIFs
     * - /trending   - Trending GIFs
     * - /random     - Random GIF
     * - /{gif_id}   - Get specific GIF
     * - /translate  - Convert text to GIF
     */
    baseURL: 'https://api.giphy.com/v1/gifs',

    // ========================================================================
    // DEFAULT PARAMETERS
    // ========================================================================
    /**
     * params - Query parameters included in EVERY request
     * 
     * WHAT ARE QUERY PARAMETERS?
     * Key-value pairs appended to the URL after '?'
     * Format: ?key1=value1&key2=value2
     * 
     * HOW IT WORKS:
     * These params are merged with any params provided in individual requests.
     * 
     * EXAMPLE:
     * giphyApi.get('/search', { params: { q: 'cat', limit: 10 } })
     * 
     * Final URL:
     * https://api.giphy.com/v1/gifs/search?q=cat&limit=10&lang=es&api_key=XXX
     *                                        ↑                  ↑              ↑
     *                                        |                  |              └─ From config
     *                                        |                  └──────────────── From config
     *                                        └─────────────────────────────────── From request
     * 
     * MERGING BEHAVIOR:
     * - Default params (lang, api_key) are ALWAYS included
     * - Request-specific params (q, limit) are added
     * - If there's a conflict, request params override defaults
     * 
     * WHY USE DEFAULT PARAMS?
     * ✅ API key is needed for EVERY request
     * ✅ Language preference applies to all requests
     * ✅ Don't need to repeat in every action
     * ✅ Ensures consistency
     */
    params: {

        /**
         * lang - Language preference for GIF titles and content
         * 
         * VALUE: 'es' (Spanish)
         * 
         * WHAT IT DOES:
         * GIPHY API returns GIF titles and metadata in the specified language
         * when available.
         * 
         * SUPPORTED LANGUAGES:
         * - 'en' - English (default)
         * - 'es' - Spanish
         * - 'pt' - Portuguese
         * - 'fr' - French
         * - 'de' - German
         * - 'it' - Italian
         * - 'ja' - Japanese
         * - 'ko' - Korean
         * - 'zh-CN' - Chinese (Simplified)
         * - 'zh-TW' - Chinese (Traditional)
         * - And more...
         * 
         * EXAMPLE EFFECT:
         * Search for "cat" with lang=es:
         * - Might return: "Gato Divertido"
         * 
         * Search for "cat" with lang=en:
         * - Might return: "Funny Cat"
         * 
         * NOTE:
         * Not all GIFs have translations. If a translation isn't available,
         * the API falls back to English.
         * 
         * MAKING IT DYNAMIC:
         * Could be based on user's browser language:
         * lang: navigator.language.split('-')[0]
         * 
         * Or from app settings:
         * lang: import.meta.env.VITE_APP_LANGUAGE || 'en'
         */
        lang: 'es',

        /**
         * api_key - Your GIPHY API key for authentication
         * 
         * ENVIRONMENT VARIABLE:
         * import.meta.env.VITE_GIPHY_API_KEY
         *   ↑          ↑         ↑
         *   |          |         └─ Variable name
         *   |          └─────────── Object containing env vars
         *   └────────────────────── Vite's way to access env vars
         * 
         * WHAT IS import.meta.env?
         * Vite (your build tool) provides environment variables through
         * import.meta.env object. This is Vite-specific syntax.
         * 
         * OTHER BUILD TOOLS:
         * - Create React App: process.env.REACT_APP_GIPHY_API_KEY
         * - Next.js: process.env.NEXT_PUBLIC_GIPHY_API_KEY
         * - Vite: import.meta.env.VITE_GIPHY_API_KEY
         * 
         * VITE ENVIRONMENT VARIABLE RULES:
         * ✅ Must start with VITE_ to be exposed to client
         * ✅ Defined in .env file in project root
         * ✅ Type-safe with TypeScript (can define types)
         * 
         * .env FILE EXAMPLE:
         * VITE_GIPHY_API_KEY=abc123xyz789yourAPIkey
         * VITE_APP_NAME=GIF Search
         * VITE_API_BASE_URL=https://api.giphy.com
         * 
         * WHY THE VITE_ PREFIX?
         * Security! Without it, Vite WON'T expose the variable to your
         * client-side code. This prevents accidentally exposing sensitive
         * server-only variables (like database passwords).
         * 
         * ACCESSING THE VALUE:
         * console.log(import.meta.env.VITE_GIPHY_API_KEY);
         * // Output: "abc123xyz789yourAPIkey"
         * 
         * SECURITY CONSIDERATIONS:
         * ⚠️ IMPORTANT: Client-side API keys are visible to users!
         * Anyone can open DevTools → Network tab and see your API key.
         * 
         * BEST PRACTICES:
         * ✅ Use API keys with domain restrictions (GIPHY allows this)
         * ✅ Use keys with rate limits
         * ✅ Never commit .env file to Git (.gitignore it)
         * ✅ Use different keys for dev/staging/production
         * ✅ For sensitive operations, use a backend proxy
         * 
         * .gitignore SHOULD INCLUDE:
         * .env
         * .env.local
         * .env.*.local
         * 
         * PROVIDE .env.example:
         * VITE_GIPHY_API_KEY=your_api_key_here
         * 
         * So other developers know what variables are needed.
         * 
         * GETTING A GIPHY API KEY:
         * 1. Go to https://developers.giphy.com/
         * 2. Create an account
         * 3. Create a new app
         * 4. Copy the API key
         * 5. Add to .env file
         * 
         * FREE TIER LIMITS:
         * - 42 requests per hour per IP (with API key)
         * - 1000 requests per day
         * - Rate limit headers in response
         * 
         * WHAT IF KEY IS MISSING?
         * If VITE_GIPHY_API_KEY is undefined:
         * - Requests will fail with 401 Unauthorized
         * - GIPHY API requires a valid key
         * 
         * DEFENSIVE PROGRAMMING:
         * Could add validation:
         * if (!import.meta.env.VITE_GIPHY_API_KEY) {
         *   throw new Error('GIPHY API key is not configured');
         * }
         * 
         * TYPESCRIPT ENV VARS:
         * Can create src/vite-env.d.ts:
         * 
         * interface ImportMetaEnv {
         *   readonly VITE_GIPHY_API_KEY: string;
         *   readonly VITE_APP_NAME: string;
         * }
         * 
         * This provides autocomplete and type checking!
         */
        api_key: import.meta.env.VITE_GIPHY_API_KEY,
    },
});

// ============================================================================
// USAGE EXAMPLES IN OTHER FILES:
// ============================================================================
//
// BASIC GET REQUEST:
// import { giphyApi } from './api/giphy.api';
//
// const response = await giphyApi.get('/search', {
//   params: { q: 'cat', limit: 10 }
// });
// // URL: https://api.giphy.com/v1/gifs/search?q=cat&limit=10&lang=es&api_key=XXX
//
// SHORTHAND (without .get):
// const response = await giphyApi('/search', {
//   params: { q: 'dog' }
// });
//
// WITH TYPESCRIPT GENERICS:
// interface GiphyResponse {
//   data: Gif[];
//   meta: { status: number };
// }
//
// const response = await giphyApi.get<GiphyResponse>('/search', {
//   params: { q: 'bird' }
// });
// // response.data is typed as GiphyResponse
//
// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. AXIOS INSTANCE CREATION
//    - Create custom HTTP client with defaults
//    - Separate configuration from usage
//    - Reusable across application
//
// 2. BASE URL CONFIGURATION
//    - Avoid repeating full URLs
//    - Easy to change API version
//    - Cleaner code in actions
//
// 3. DEFAULT PARAMETERS
//    - API key included automatically
//    - Language preference set once
//    - Consistent across all requests
//
// 4. ENVIRONMENT VARIABLES
//    - Secure API key management
//    - Different keys per environment
//    - Never commit secrets to Git
//
// 5. VITE ENV VARS (import.meta.env)
//    - Vite-specific syntax
//    - Must start with VITE_
//    - Available at build time
//
// 6. MODULE EXPORTS
//    - Export configured instance
//    - Import in action files
//    - Centralized configuration
//
// 7. SEPARATION OF CONCERNS
//    - API config separate from business logic
//    - Easy to test and mock
//    - Single Responsibility Principle
//
// ============================================================================
// ADVANCED CONFIGURATIONS (Not Implemented Here):
// ============================================================================
//
// TIMEOUT:
// export const giphyApi = axios.create({
//   baseURL: '...',
//   timeout: 5000,  // 5 seconds
// });
//
// CUSTOM HEADERS:
// export const giphyApi = axios.create({
//   baseURL: '...',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });
//
// REQUEST INTERCEPTOR (modify requests before sending):
// giphyApi.interceptors.request.use(
//   (config) => {
//     console.log('Making request to:', config.url);
//     // Add auth token, modify headers, etc.
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
//
// RESPONSE INTERCEPTOR (handle responses globally):
// giphyApi.interceptors.response.use(
//   (response) => {
//     // Transform response data
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response?.status === 401) {
//       // Redirect to login
//     }
//     if (error.response?.status === 429) {
//       // Handle rate limiting
//     }
//     return Promise.reject(error);
//   }
// );
//
// RETRY LOGIC:
// import axiosRetry from 'axios-retry';
//
// axiosRetry(giphyApi, {
//   retries: 3,
//   retryDelay: axiosRetry.exponentialDelay,
//   retryCondition: (error) => {
//     return error.response?.status === 429; // Retry on rate limit
//   }
// });
//
// ============================================================================
// ENVIRONMENT SETUP CHECKLIST:
// ============================================================================
//
// 1. CREATE .env FILE (in project root):
//    VITE_GIPHY_API_KEY=your_actual_api_key_here
//
// 2. ADD TO .gitignore:
//    .env
//    .env.local
//    .env.*.local
//
// 3. CREATE .env.example (commit this):
//    VITE_GIPHY_API_KEY=your_api_key_here
//
// 4. GET GIPHY API KEY:
//    - Visit https://developers.giphy.com/
//    - Sign up / Log in
//    - Create new app
//    - Copy API key
//    - Paste into .env file
//
// 5. RESTART DEV SERVER:
//    Vite only loads .env at startup
//    Stop and restart: npm run dev
//
// 6. VERIFY IT WORKS:
//    console.log(import.meta.env.VITE_GIPHY_API_KEY);
//    Should print your API key (in development)
//
// ============================================================================
// SECURITY BEST PRACTICES:
// ============================================================================
//
// ✅ DO:
// - Use environment variables for API keys
// - Add .env to .gitignore
// - Use different keys for dev/prod
// - Enable domain restrictions on GIPHY dashboard
// - Monitor API usage for abuse
// - Use rate limiting
//
// ❌ DON'T:
// - Hardcode API keys in source code
// - Commit .env file to Git
// - Share API keys in public repositories
// - Use production keys in development
// - Expose backend-only secrets to frontend
//
// ⚠️ REMEMBER:
// Frontend API keys are PUBLIC! Anyone can see them in:
// - DevTools → Network tab
// - Source code (even minified)
// - Browser console
//
// For truly sensitive operations:
// - Use a backend proxy
// - Let backend make API calls
// - Frontend calls your backend
// - Backend uses secret API key
//
// ============================================================================
// ALTERNATIVE API CLIENTS:
// ============================================================================
//
// NATIVE FETCH:
// export const giphyApi = (endpoint, options = {}) => {
//   const url = `https://api.giphy.com/v1/gifs${endpoint}`;
//   const params = new URLSearchParams({
//     lang: 'es',
//     api_key: import.meta.env.VITE_GIPHY_API_KEY,
//     ...options.params
//   });
//   return fetch(`${url}?${params}`, options).then(r => r.json());
// };
//
// Pros: No dependencies
// Cons: More verbose, manual error handling
//
// OTHER LIBRARIES:
// - ky: Modern fetch wrapper
// - got: Alternative to axios
// - superagent: Older, still used
//
// Axios remains the most popular for React apps
//
// ============================================================================
// TESTING THIS MODULE:
// ============================================================================
//
// MOCK IN TESTS:
// import { giphyApi } from './giphy.api';
// import MockAdapter from 'axios-mock-adapter';
//
// const mock = new MockAdapter(giphyApi);
//
// mock.onGet('/search').reply(200, {
//   data: [{ id: '1', title: 'Test GIF' }]
// });
//
// Or with Jest:
// jest.mock('./api/giphy.api');
// giphyApi.get.mockResolvedValue({ data: { ... } });
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add timeout configuration (5 seconds)
// 2. Add request interceptor to log all requests
// 3. Add response interceptor to handle 429 (rate limit) errors
// 4. Create TypeScript types for import.meta.env
// 5. Add error handling for missing API key
// 6. Create a second API client for another service
// 7. Add retry logic for failed requests
// 8. Implement request cancellation
// 9. Add response caching with axios-cache-adapter
// 10. Create integration tests using the API client
// ============================================================================