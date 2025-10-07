// ============================================================================
// getGifsByQuery - API Action for Fetching GIFs
// ============================================================================
// This file contains an "action" - a function that interacts with an external
// API. In the context of this application, "actions" are functions that:
// - Make HTTP requests to external services
// - Transform API responses into app-specific formats
// - Handle data fetching logic
// - Are typically async functions
//
// ARCHITECTURAL PATTERN:
// This follows the "Actions" pattern where API calls are separated from:
// - Components (UI logic)
// - Hooks (state management logic)
// - API configuration (base URL, headers, etc.)
//
// BENEFITS OF THIS PATTERN:
// ✅ Single Responsibility: Only handles data fetching
// ✅ Reusable: Can be called from multiple places
// ✅ Testable: Easy to mock API responses
// ✅ Maintainable: API changes happen in one place
// ✅ Type-Safe: TypeScript ensures correct data shapes
//
// LEARNING CONCEPTS:
// - Async/Await: Handling asynchronous operations
// - API Requests: Making HTTP calls
// - Data Transformation: Converting API format to app format
// - TypeScript Generics: Type-safe API responses
// - Array.map(): Transforming array data
// - Object Destructuring & Mapping
// - Type Annotations: Promise return types
// - Number Conversion: Type coercion
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * Import GiphyResponse type
 * 
 * TYPE-ONLY IMPORT:
 * 'import type' tells TypeScript this is only used for type checking.
 * It won't appear in the compiled JavaScript.
 * 
 * GIPHYRESPONSE:
 * This interface defines the EXACT structure of data returned by the
 * GIPHY API. It probably looks like:
 * 
 * interface GiphyResponse {
 *   data: Array<{
 *     id: string;
 *     title: string;
 *     images: {
 *       original: {
 *         url: string;
 *         width: string;    // ⚠️ Note: API returns string, not number!
 *         height: string;
 *       };
 *       // ... other image sizes
 *     };
 *     // ... other properties
 *   }>;
 *   meta: {
 *     status: number;
 *     msg: string;
 *   };
 *   pagination: {
 *     total_count: number;
 *     count: number;
 *     offset: number;
 *   };
 * }
 * 
 * WHY DEFINE THIS TYPE?
 * - Documents what the API returns
 * - Catches API changes at compile time
 * - Enables autocomplete when accessing response properties
 * - Makes code self-documenting
 */
import type { GiphyResponse } from "../interface/giphy.response";

/**
 * Import Gif type - OUR application's format
 * 
 * GIF INTERFACE:
 * This is simpler than GiphyResponse and contains only what our app needs:
 * 
 * interface Gif {
 *   id: string;
 *   title: string;
 *   url: string;
 *   width: number;    // ⚠️ Note: WE store as number (converted from API string)
 *   height: number;
 * }
 * 
 * WHY TWO DIFFERENT TYPES?
 * GiphyResponse: What the API gives us (complex, external format)
 * Gif: What our app uses (simple, internal format)
 * 
 * BENEFITS OF SEPARATION:
 * ✅ App doesn't depend on API structure
 * ✅ If API changes, only this file needs updates
 * ✅ Simpler data structure for components
 * ✅ Can combine data from multiple APIs
 */
import type { Gif } from "../interface/gif.interface";

/**
 * Import configured API client
 * 
 * GIPHY API:
 * This is likely an Axios instance or similar HTTP client that's
 * pre-configured with:
 * - Base URL (https://api.giphy.com/v1/gifs)
 * - API Key (in headers or params)
 * - Default headers
 * - Timeout settings
 * - Error interceptors
 * 
 * EXAMPLE CONFIGURATION (what giphyApi might look like):
 * 
 * import axios from 'axios';
 * 
 * export const giphyApi = axios.create({
 *   baseURL: 'https://api.giphy.com/v1/gifs',
 *   params: {
 *     api_key: 'YOUR_API_KEY'
 *   },
 *   timeout: 5000
 * });
 * 
 * BENEFITS OF PRE-CONFIGURED CLIENT:
 * ✅ API key stored in one place
 * ✅ Base URL defined once
 * ✅ Don't repeat configuration
 * ✅ Easy to switch APIs
 */
import { giphyApi } from "../api/giphy.api";

// ============================================================================
// ACTION FUNCTION
// ============================================================================

/**
 * getGifsByQuery - Fetches GIFs from GIPHY API based on search query
 * 
 * FUNCTION SIGNATURE BREAKDOWN:
 * 
 * export const getGifsByQuery = async (query: string): Promise<Gif[]> => { }
 *   ↑      ↑         ↑            ↑       ↑       ↑        ↑         ↑
 *   |      |         |            |       |       |        |         └─ Returns array
 *   |      |         |            |       |       |        └─────────── Of Gif objects
 *   |      |         |            |       |       └──────────────────── Wrapped in Promise
 *   |      |         |            |       └──────────────────────────── Type annotation
 *   |      |         |            └──────────────────────────────────── Parameter type
 *   |      |         └───────────────────────────────────────────────── Async function
 *   |      └─────────────────────────────────────────────────────────── Function name
 *   └────────────────────────────────────────────────────────────────── Export for use elsewhere
 * 
 * ASYNC KEYWORD:
 * - Allows us to use 'await' inside the function
 * - Automatically wraps return value in a Promise
 * - Makes async code look synchronous
 * 
 * PROMISE<GIF[]>:
 * This tells TypeScript: "This function returns a Promise that will
 * eventually resolve to an array of Gif objects"
 * 
 * WHY EXPLICIT RETURN TYPE?
 * - Documents what the function returns
 * - TypeScript validates the return value
 * - Helps catch errors early
 * - Better IDE autocomplete
 * 
 * FLOW:
 * 1. Receive search query from user
 * 2. Make API request to GIPHY
 * 3. Wait for response
 * 4. Transform complex API data → simple app data
 * 5. Return array of Gif objects
 * 
 * @param {string} query - The search term (e.g., "cat", "funny dog")
 * @returns {Promise<Gif[]>} - Promise that resolves to array of Gif objects
 */
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {

    // ========================================================================
    // API REQUEST WITH AXIOS/HTTP CLIENT
    // ========================================================================
    /**
     * Make HTTP GET request to GIPHY search endpoint
     * 
     * AXIOS CALL BREAKDOWN:
     * giphyApi<GiphyResponse>('/search', { params: { ... } })
     *    ↑            ↑            ↑              ↑
     *    |            |            |              └─ Request configuration
     *    |            |            └──────────────── Endpoint path
     *    |            └───────────────────────────── Generic type (response type)
     *    └────────────────────────────────────────── Pre-configured client
     * 
     * TYPESCRIPT GENERIC:
     * <GiphyResponse> tells TypeScript: "This request will return data
     * that matches the GiphyResponse interface"
     * 
     * Result: response.data will be typed as GiphyResponse
     * 
     * FULL URL CONSTRUCTED:
     * If giphyApi baseURL = 'https://api.giphy.com/v1/gifs'
     * And we call '/search'
     * Full URL = 'https://api.giphy.com/v1/gifs/search?q=cat&limit=10&api_key=XXX'
     * 
     * PARAMS OBJECT:
     * These become URL query parameters:
     * {
     *   q: 'cat',      → ?q=cat
     *   limit: 10,     → &limit=10
     * }
     * 
     * API KEY:
     * Usually added automatically by giphyApi configuration
     * So final URL: /search?q=cat&limit=10&api_key=YOUR_KEY
     * 
     * AWAIT KEYWORD:
     * Pauses execution until the HTTP request completes
     * Without await, 'response' would be a Promise, not the actual data
     * 
     * WHAT'S IN THE RESPONSE?
     * Axios returns an object with:
     * {
     *   data: GiphyResponse,  ← The actual API response data
     *   status: 200,          ← HTTP status code
     *   statusText: 'OK',     ← Status message
     *   headers: {...},       ← Response headers
     *   config: {...},        ← Request configuration
     *   request: {...}        ← Original request object
     * }
     * 
     * We only care about 'data' property, which contains the GiphyResponse
     */
    const response = await giphyApi<GiphyResponse>('/search', {
        params: {
            /**
             * q - Query parameter
             * The search term to send to GIPHY API
             * 
             * EXAMPLE:
             * query = 'cat'
             * URL param: ?q=cat
             */
            q: query,

            /**
             * limit - Maximum number of results to return
             * 
             * GIPHY API supports various limits:
             * - Min: 1
             * - Max: 50 (free tier)
             * - Default: 25 (if not specified)
             * 
             * WHY 10?
             * Good balance between:
             * ✅ Fast response time (less data)
             * ✅ Enough variety for users
             * ✅ Reasonable API usage
             * 
             * ADJUSTABLE:
             * Could make this a parameter:
             * getGifsByQuery(query, limit = 10)
             */
            limit: 10,
        },
    });

    // ========================================================================
    // DEBUG LOGGING (Commented Out)
    // ========================================================================
    /**
     * This console.log is commented out but useful during development
     * 
     * WHAT IT WOULD SHOW:
     * {
     *   data: [
     *     { id: '123', title: 'Cat', images: {...}, ... },
     *     { id: '456', title: 'Dog', images: {...}, ... },
     *     ...
     *   ],
     *   meta: { status: 200, msg: 'OK' },
     *   pagination: { total_count: 1000, count: 10, offset: 0 }
     * }
     * 
     * WHEN TO USE:
     * - Debugging API responses
     * - Verifying data structure
     * - Troubleshooting mapping errors
     * 
     * REMOVE IN PRODUCTION:
     * Console.logs can:
     * - Clutter browser console
     * - Expose sensitive data
     * - Impact performance (slightly)
     * 
     * BETTER ALTERNATIVES:
     * - Use debugging tools (React DevTools, Redux DevTools)
     * - Proper logging library (for production)
     * - Error tracking service (Sentry, LogRocket)
     */
    // console.log(response.data);

    // ========================================================================
    // DATA TRANSFORMATION - API Format → App Format
    // ========================================================================
    /**
     * Transform GIPHY API response into our app's Gif format
     * 
     * BREAKDOWN:
     * return response.data.data.map((gif) => ({ ... }))
     *          ↑        ↑     ↑    ↑    ↑     ↑
     *          |        |     |    |    |     └─ Object to return
     *          |        |     |    |    └─────── Arrow function
     *          |        |     |    └──────────── Current gif from array
     *          |        |     └───────────────── Array method
     *          |        └─────────────────────── Array of gifs
     *          └──────────────────────────────── Axios response
     * 
     * WHY response.data.data?
     * - response.data → Gets Axios response data (the GiphyResponse)
     * - .data → Accesses the 'data' property of GiphyResponse (array of gifs)
     * 
     * CONFUSING NAMING:
     * response.data.data looks weird because:
     * - First 'data' is Axios convention
     * - Second 'data' is GIPHY API's property name
     * 
     * ARRAY.MAP() TRANSFORMATION:
     * Takes each complex GIPHY gif object and transforms it into our
     * simpler Gif format
     * 
     * BEFORE (GIPHY format):
     * {
     *   id: "abc123",
     *   title: "Funny Cat GIF",
     *   images: {
     *     original: {
     *       url: "https://media.giphy.com/cat.gif",
     *       width: "480",      ← String!
     *       height: "360",     ← String!
     *       size: "1234567"
     *     },
     *     fixed_height: { ... },
     *     fixed_width: { ... },
     *     // ... 20+ other image sizes
     *   },
     *   type: "gif",
     *   rating: "g",
     *   user: { ... },
     *   analytics: { ... },
     *   // ... many more properties we don't need
     * }
     * 
     * AFTER (Our format):
     * {
     *   id: "abc123",
     *   title: "Funny Cat GIF",
     *   url: "https://media.giphy.com/cat.gif",
     *   width: 480,    ← Number!
     *   height: 360    ← Number!
     * }
     * 
     * BENEFITS OF TRANSFORMATION:
     * ✅ Smaller objects (less memory)
     * ✅ Simpler to use in components
     * ✅ Only includes what we need
     * ✅ Consistent format across app
     * ✅ Easier to test
     * ✅ If API changes, only this file needs updates
     */
    return response.data.data.map((gif) => ({

        /**
         * id - Unique identifier for the GIF
         * 
         * Direct copy from API (no transformation needed)
         * Used as React key in list rendering
         * 
         * EXAMPLE: "abc123def456"
         */
        id: gif.id,

        /**
         * title - Description/name of the GIF
         * 
         * Direct copy from API
         * Displayed to users and used for alt text
         * 
         * EXAMPLE: "Cat Dancing GIF by GIPHY Studios"
         * 
         * NOTE: Some GIFs have empty titles
         * Production code might want:
         * title: gif.title || 'Untitled GIF'
         */
        title: gif.title,

        /**
         * url - Direct link to the GIF image file
         * 
         * NAVIGATION THROUGH NESTED OBJECT:
         * gif.images.original.url
         *  ↑     ↑       ↑      ↑
         *  |     |       |      └─ url property (string)
         *  |     |       └──────── original size object
         *  |     └──────────────── images object (contains multiple sizes)
         *  └────────────────────── Current gif object
         * 
         * WHY images.original?
         * GIPHY provides multiple image sizes:
         * - original (full size)
         * - fixed_height (200px height)
         * - fixed_width (200px width)
         * - downsized (smaller file size)
         * - preview (very small, for loading)
         * - And many more...
         * 
         * We choose 'original' for best quality
         * 
         * ALTERNATIVE APPROACH:
         * Could use smaller size for performance:
         * url: gif.images.fixed_height.url  // Smaller file size
         * 
         * EXAMPLE URL:
         * "https://media0.giphy.com/media/abc123/giphy.gif"
         */
        url: gif.images.original.url,

        /**
         * width - Image width in pixels
         * 
         * NUMBER CONVERSION:
         * Number(gif.images.original.width)
         *   ↑         ↑
         *   |         └─ API returns string: "480"
         *   └─────────── Convert to number: 480
         * 
         * WHY DOES API RETURN STRING?
         * APIs often return numbers as strings because:
         * - JSON standard (all properties are strings)
         * - Backwards compatibility
         * - Easier serialization
         * 
         * WHY CONVERT TO NUMBER?
         * ✅ Mathematical operations work: width * 2
         * ✅ Type consistency in our app
         * ✅ Proper TypeScript typing
         * ✅ No accidental string concatenation: width + height
         * 
         * NUMBER() FUNCTION:
         * Number("480")  → 480
         * Number("abc")  → NaN (Not a Number)
         * Number("")     → 0
         * Number(null)   → 0
         * 
         * POTENTIAL ISSUE:
         * If API returns invalid number, we get NaN
         * Production code might want:
         * width: Number(gif.images.original.width) || 0
         * 
         * ALTERNATIVES:
         * - parseInt(gif.images.original.width, 10)
         * - +gif.images.original.width (unary plus)
         * - parseFloat(gif.images.original.width)
         * 
         * Number() is preferred because:
         * - Handles decimals
         * - More explicit
         * - Consistent behavior
         */
        width: Number(gif.images.original.width),

        /**
         * height - Image height in pixels
         * 
         * Same conversion as width
         * See width comments for detailed explanation
         * 
         * EXAMPLE:
         * API: "360" (string)
         * Our app: 360 (number)
         */
        height: Number(gif.images.original.height),

        /**
         * IMPLICIT RETURN:
         * The arrow function uses parentheses (), which means
         * it implicitly returns this object.
         * 
         * This syntax:
         * (gif) => ({ id: gif.id, ... })
         * 
         * Is equivalent to:
         * (gif) => {
         *   return { id: gif.id, ... }
         * }
         * 
         * IMPORTANT - PARENTHESES FOR OBJECTS:
         * When returning an object literal, you MUST use parentheses
         * 
         * ✅ CORRECT:
         * (gif) => ({ id: gif.id })
         * 
         * ❌ WRONG (JavaScript thinks { } is a code block, not object):
         * (gif) => { id: gif.id }
         * 
         * The parentheses tell JavaScript: "This is an object, not a code block"
         */
    }))
    /**
     * FINAL RESULT:
     * An array of transformed Gif objects:
     * 
     * [
     *   { id: '1', title: 'Cat', url: '...', width: 480, height: 360 },
     *   { id: '2', title: 'Dog', url: '...', width: 640, height: 480 },
     *   { id: '3', title: 'Bird', url: '...', width: 320, height: 240 },
     *   ... (up to 10 items)
     * ]
     * 
     * This array is what gets returned to the calling function (useGif hook)
     */
};

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. ACTIONS PATTERN
//    - Separate API logic from components/hooks
//    - Single responsibility (just fetch and transform)
//    - Reusable across application
//    - Easy to test in isolation
//
// 2. ASYNC/AWAIT
//    - Handle asynchronous HTTP requests
//    - Makes async code look synchronous
//    - Cleaner than .then() chains
//    - Better error handling with try/catch
//
// 3. DATA TRANSFORMATION
//    - Convert external API format → internal app format
//    - Reduces coupling to external services
//    - Simplifies data structure
//    - Protects app from API changes
//
// 4. TYPESCRIPT GENERICS
//    - giphyApi<GiphyResponse> for type-safe responses
//    - Promise<Gif[]> for return type annotation
//    - Compile-time type checking
//    - Better IDE support
//
// 5. ARRAY.MAP() TRANSFORMATION
//    - Transform each element in array
//    - Returns new array (immutable)
//    - Implicit return with parentheses
//    - Common pattern for data transformation
//
// 6. TYPE CONVERSION
//    - Number() to convert string to number
//    - Necessary because APIs often return numbers as strings
//    - Ensures type consistency
//    - Prevents concatenation bugs
//
// 7. OBJECT DESTRUCTURING IN PARAMETERS
//    - Access nested properties: gif.images.original.url
//    - Clean and readable
//    - TypeScript provides autocomplete
//
// 8. AXIOS/HTTP CLIENT CONFIGURATION
//    - Pre-configured client (giphyApi)
//    - Base URL and API key in one place
//    - Consistent request configuration
//
// ============================================================================
// API INTERACTION FLOW:
// ============================================================================
//
// 1. USER ACTION
//    User types "cat" and presses enter
//    ↓
// 2. COMPONENT CALLS HOOK
//    Component calls: handleSearch('cat')
//    ↓
// 3. HOOK CALLS ACTION
//    Hook calls: getGifsByQuery('cat')
//    ↓
// 4. HTTP REQUEST
//    Action makes request to:
//    GET https://api.giphy.com/v1/gifs/search?q=cat&limit=10&api_key=XXX
//    ↓
// 5. API RESPONDS
//    GIPHY returns JSON with 10 GIF objects (complex format)
//    ↓
// 6. DATA TRANSFORMATION
//    Action transforms: GiphyResponse → Gif[]
//    ↓
// 7. RETURN TO HOOK
//    Action returns: [{ id, title, url, width, height }, ...]
//    ↓
// 8. HOOK UPDATES STATE
//    Hook calls: setGifs(gifs)
//    ↓
// 9. COMPONENT RE-RENDERS
//    Component displays new GIFs
//
// ============================================================================
// ERROR HANDLING (Not Implemented Here):
// ============================================================================
//
// CURRENT CODE:
// No error handling - if API fails, app crashes
//
// PRODUCTION-READY VERSION:
//
// export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
//   try {
//     const response = await giphyApi<GiphyResponse>('/search', {
//       params: { q: query, limit: 10 }
//     });
//
//     return response.data.data.map((gif) => ({
//       id: gif.id,
//       title: gif.title,
//       url: gif.images.original.url,
//       width: Number(gif.images.original.width),
//       height: Number(gif.images.original.height),
//     }));
//   } catch (error) {
//     console.error('Failed to fetch GIFs:', error);
//
//     // Option 1: Return empty array
//     return [];
//
//     // Option 2: Re-throw with custom error
//     throw new Error(`Failed to search for "${query}"`);
//
//     // Option 3: Return error indicator
//     // (would need to change return type)
//   }
// }
//
// ============================================================================
// PERFORMANCE CONSIDERATIONS:
// ============================================================================
//
// ✅ GOOD:
// - Limits results to 10 (reasonable size)
// - Simple transformation (fast)
// - Uses original images (best quality)
//
// 🔄 COULD IMPROVE:
// - Use smaller image size (fixed_height) for faster loading
// - Implement request cancellation (AbortController)
// - Add retry logic for failed requests
// - Cache requests (done in useGif hook)
// - Implement pagination for more results
//
// ============================================================================
// TYPESCRIPT BENEFITS IN THIS FILE:
// ============================================================================
//
// 1. Generic HTTP Client
//    giphyApi<GiphyResponse> ensures response matches expected type
//
// 2. Return Type Annotation
//    Promise<Gif[]> documents and validates return value
//
// 3. Parameter Typing
//    query: string prevents non-string values
//
// 4. Interface Enforcement
//    Mapped object must match Gif interface
//
// 5. Autocomplete
//    IDE suggests gif.images.original.url as you type
//
// 6. Compile-Time Errors
//    Typos caught before runtime: gif.images.orignal → Error!
//
// ============================================================================
// ALTERNATIVES AND VARIATIONS:
// ============================================================================
//
// 1. ADDITIONAL PARAMETERS
//    export const getGifsByQuery = async (
//      query: string,
//      limit: number = 10,
//      rating: 'g' | 'pg' | 'pg-13' | 'r' = 'g'
//    ): Promise<Gif[]> => { ... }
//
// 2. PAGINATION
//    export const getGifsByQuery = async (
//      query: string,
//      offset: number = 0
//    ): Promise<{ gifs: Gif[]; total: number }> => { ... }
//
// 3. DIFFERENT IMAGE SIZE
//    url: gif.images.fixed_height.url,  // Smaller, faster
//
// 4. INCLUDE MORE DATA
//    return response.data.data.map((gif) => ({
//      id: gif.id,
//      title: gif.title,
//      url: gif.images.original.url,
//      width: Number(gif.images.original.width),
//      height: Number(gif.images.original.height),
//      rating: gif.rating,           // Add rating
//      username: gif.username,        // Add creator
//      trendingDate: gif.trending_datetime  // Add timestamp
//    }))
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add try/catch error handling
// 2. Add optional 'limit' parameter with default value
// 3. Add 'rating' filter parameter (g, pg, pg-13, r)
// 4. Return pagination info (total count, offset)
// 5. Add request timeout handling
// 6. Implement request cancellation with AbortController
// 7. Add response validation (check if data exists)
// 8. Create a second action: getTrendingGifs()
// 9. Add unit tests using a mocked API client
// 10. Add JSDoc comments for better documentation
// ============================================================================