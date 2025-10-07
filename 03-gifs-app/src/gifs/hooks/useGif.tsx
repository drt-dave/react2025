// ============================================================================
// useGif - Custom Hook for GIF Search Logic
// ============================================================================
// This is a CUSTOM HOOK that encapsulates all the business logic for the
// GIF search application. It manages state, caching, and API calls.
//
// WHAT IS A CUSTOM HOOK?
// A custom hook is a JavaScript function that:
// - Starts with "use" (React convention/requirement)
// - Can use other React hooks (useState, useEffect, useRef, etc.)
// - Encapsulates reusable logic
// - Returns values and functions that components can use
//
// WHY USE CUSTOM HOOKS?
// - Separate business logic from UI components
// - Make logic reusable across multiple components
// - Easier to test (test logic independently from UI)
// - Cleaner component code (components focus on rendering)
// - Single Responsibility Principle (SRP)
//
// LEARNING CONCEPTS:
// - Custom Hooks: Creating reusable stateful logic
// - useState: Managing component state
// - useRef: Persisting values across renders without triggering re-renders
// - Caching: Storing API results to avoid duplicate requests
// - Async/Await: Handling asynchronous operations
// - TypeScript Generics: Type-safe state and refs
// - Array Methods: splice, includes, spread operator
// - Record Type: TypeScript type for key-value objects
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================
import {
    useRef,      // Hook for persisting values without causing re-renders
    useState     // Hook for managing state that triggers re-renders
} from "react";

// Import the action that fetches GIFs from the API
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";

// Import the Gif type definition
import type { Gif } from "../interface/gif.interface";

// ============================================================================
// ALTERNATIVE CACHING APPROACH (Commented Out)
// ============================================================================
/**
 * ALTERNATIVE: Module-level cache
 * 
 * const gifsCache: Record<string, Gif[]> = {};
 * 
 * This would create a cache OUTSIDE the hook, at the module level.
 * 
 * DIFFERENCES BETWEEN MODULE-LEVEL CACHE vs useRef CACHE:
 * 
 * MODULE-LEVEL (commented approach):
 * ✅ Persists across component unmounts/remounts
 * ✅ Shared between ALL instances of components using this hook
 * ✅ Never gets reset unless you manually clear it
 * ❌ Can cause memory leaks if not managed
 * ❌ Harder to test (global state)
 * ❌ Not isolated per component instance
 * 
 * useRef CACHE (current implementation):
 * ✅ Isolated per component instance
 * ✅ Automatically cleaned up when component unmounts
 * ✅ Easier to test (no global state)
 * ✅ More predictable behavior
 * ❌ Lost when component unmounts
 * ❌ Not shared between component instances
 * 
 * WHEN TO USE EACH:
 * - useRef: Most cases, when you want instance-specific cache
 * - Module-level: When you want cache shared across the entire app
 */
// const gifsCache: Record<string, Gif[]> = {};

// ============================================================================
// CUSTOM HOOK DEFINITION
// ============================================================================
/**
 * useGif - Custom hook for managing GIF search state and logic
 * 
 * This hook manages:
 * 1. Current list of GIFs to display
 * 2. Previous search terms history
 * 3. Cache of API results
 * 4. Search functionality
 * 5. Click handlers for previous terms
 * 
 * NAMING CONVENTION:
 * Custom hooks MUST start with "use" so React knows:
 * - It's a hook (can call other hooks inside)
 * - It follows Rules of Hooks
 * - ESLint can check it properly
 * 
 * RETURN VALUE:
 * Returns an object with:
 * - State values (gifs, previousTerms)
 * - Functions (handleSearch, handleTermClicked)
 * 
 * This pattern is called "returning an object" and allows:
 * - Destructuring in the component: const { gifs, handleSearch } = useGif()
 * - Choosing only what you need
 * - Self-documenting code (clear names)
 * 
 * @returns Object containing state and handler functions
 */
export const useGif = () => {

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    /**
     * gifs - Array of GIF objects currently displayed
     * 
     * TYPESCRIPT GENERIC SYNTAX:
     * useState<Gif[]>([])
     *         ↑     ↑  ↑
     *         |     |  └─ Initial value (empty array)
     *         |     └──── Type parameter (array of Gif objects)
     *         └────────── Generic function
     * 
     * WHY TYPE THE INITIAL VALUE?
     * TypeScript can't infer the type from an empty array [].
     * We must explicitly tell it: "This will hold Gif objects"
     * 
     * WITHOUT TYPING:
     * const [gifs, setGifs] = useState([])  // TypeScript thinks: never[]
     * 
     * WITH TYPING:
     * const [gifs, setGifs] = useState<Gif[]>([])  // TypeScript knows: Gif[]
     * 
     * BENEFITS:
     * - setGifs only accepts Gif[] (type safety)
     * - Autocomplete when accessing gif properties
     * - Catches errors at compile time
     */
    const [gifs, setGifs] = useState<Gif[]>([])

    /**
     * previousTerms - Array of previous search queries (max 8)
     * 
     * This stores the history of searches to display as clickable labels.
     * Limited to 8 items to avoid cluttering the UI.
     * 
     * ARRAY ORDER:
     * Newest searches appear first: ['cat', 'dog', 'bird']
     * Most recent → Oldest
     */
    const [previousTerms, setPreviousTerms] = useState<string[]>([])

    // ========================================================================
    // CACHING WITH useRef
    // ========================================================================
    /**
     * gifsCache - Ref object that stores cached API results
     * 
     * WHAT IS useRef?
     * useRef creates a mutable object that persists across renders but
     * doesn't trigger re-renders when changed.
     * 
     * STRUCTURE:
     * useRef<Record<string, Gif[]>>({})
     *        ↑                   ↑   ↑
     *        |                   |   └─ Initial value (empty object)
     *        |                   └───── Type: object with string keys
     *        └───────────────────────── Generic type parameter
     * 
     * RECORD TYPE EXPLAINED:
     * Record<string, Gif[]> is TypeScript's utility type for objects
     * 
     * Equivalent to:
     * {
     *   [key: string]: Gif[]
     * }
     * 
     * EXAMPLE CACHE DATA:
     * {
     *   'cat': [gif1, gif2, gif3],
     *   'dog': [gif4, gif5],
     *   'funny': [gif6, gif7, gif8]
     * }
     * 
     * WHY useRef INSTEAD OF useState?
     * 
     * WITH useState:
     * const [cache, setCache] = useState({})
     * ✅ Triggers re-render when updated
     * ❌ Re-render is unnecessary (cache isn't displayed)
     * ❌ Performance hit from extra re-renders
     * 
     * WITH useRef:
     * const cache = useRef({})
     * ✅ No re-render when updated
     * ✅ Perfect for background data
     * ✅ Better performance
     * ✅ Persists across renders
     * 
     * ACCESSING THE VALUE:
     * - useState: just use the value directly → cache
     * - useRef: must use .current → gifsCache.current
     * 
     * WHY .current?
     * useRef returns an object: { current: yourValue }
     * The actual value is stored in the 'current' property
     * 
     * MUTATION IS OKAY:
     * Unlike state, you CAN mutate ref values directly:
     * gifsCache.current['cat'] = [gif1, gif2]  ✅ This is fine!
     * 
     * WHEN TO USE useRef:
     * - Values that don't affect rendering
     * - DOM references
     * - Timers, intervals
     * - Previous values
     * - Caches (like here!)
     */
    const gifsCache = useRef<Record<string, Gif[]>>({})

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    /**
     * handleTermClicked - Re-runs a previous search when user clicks a term
     * 
     * FLOW:
     * 1. User clicks on a previous search term (e.g., "cat")
     * 2. Check if we have cached results for "cat"
     * 3. If cached: Use cached results (instant, no API call)
     * 4. If not cached: Fetch from API
     * 5. Update displayed GIFs
     * 
     * ASYNC/AWAIT:
     * This function is async because it may need to wait for API response
     * 
     * @param {string} term - The search term that was clicked
     */
    const handleTermClicked = async (term: string) => {
        // ====================================================================
        // CACHE CHECK - Performance Optimization
        // ====================================================================
        /**
         * Check if we already have results for this term
         * 
         * CACHE HIT (results exist):
         * - gifsCache.current['cat'] returns: [gif1, gif2, gif3]
         * - setGifs updates state with cached results
         * - return exits function (no API call needed!)
         * - Result: Instant display, no loading, no API usage
         * 
         * CACHE MISS (results don't exist):
         * - gifsCache.current['unicorn'] returns: undefined
         * - Condition is falsy, skip this block
         * - Continue to fetch from API
         * 
         * BENEFITS OF CACHING:
         * ✅ Instant results (no loading time)
         * ✅ Reduced API calls (saves money/rate limits)
         * ✅ Better user experience
         * ✅ Works offline (if previously cached)
         * ✅ Reduces server load
         */
        if (gifsCache.current[term]) {
            setGifs(gifsCache.current[term]);  // Use cached results
            return;  // Early return - don't fetch from API
        }

        // ====================================================================
        // API CALL - Fetch Fresh Data
        // ====================================================================
        /**
         * If not in cache, fetch from API
         * 
         * AWAIT KEYWORD:
         * Pauses function execution until the promise resolves
         * Makes async code look synchronous and readable
         * 
         * WITHOUT AWAIT:
         * const gifs = getGifsByQuery(term)  // Returns a Promise
         * console.log(gifs)  // Promise {<pending>} ❌
         * 
         * WITH AWAIT:
         * const gifs = await getGifsByQuery(term)  // Waits for result
         * console.log(gifs)  // [gif1, gif2, gif3] ✅
         */
        const gifs = await getGifsByQuery(term);

        // Update displayed GIFs with fresh data
        setGifs(gifs);

        // NOTE: We're NOT caching here because this term should already
        // be in previousTerms, meaning it was cached in handleSearch
        // This prevents duplicate caching logic
    };

    /**
     * handleSearch - Processes a new search query
     * 
     * This is the main search handler that:
     * 1. Validates and cleans the query
     * 2. Checks for duplicates
     * 3. Updates search history
     * 4. Fetches results from API
     * 5. Caches the results
     * 
     * FLOW DIAGRAM:
     * User types "Cat  " 
     *   ↓
     * Trim & lowercase → "cat"
     *   ↓
     * Length check → Continue
     *   ↓
     * Duplicate check → Not in previousTerms
     *   ↓
     * Add to history (keep 8 most recent)
     *   ↓
     * Fetch from API
     *   ↓
     * Update displayed GIFs
     *   ↓
     * Cache results for future clicks
     * 
     * @param {string} query - The raw search query from user input
     */
    const handleSearch = async (query: string) => {
        // ====================================================================
        // INPUT SANITIZATION
        // ====================================================================
        /**
         * Clean up the query string
         * 
         * TRIM():
         * Removes whitespace from both ends
         * "  cat  " → "cat"
         * 
         * toLocaleLowerCase():
         * Converts to lowercase (locale-aware)
         * "CAT" → "cat"
         * "CAFÉ" → "café" (preserves accents properly)
         * 
         * WHY NOT toLowerCase()?
         * toLowerCase() works for English but may fail with some languages
         * toLocaleLowerCase() handles international characters correctly
         * 
         * WHY LOWERCASE?
         * - Makes comparison easier ("Cat" === "cat")
         * - Better cache hits (don't cache "Cat" and "cat" separately)
         * - Consistent search history display
         * 
         * MUTATION NOTE:
         * We're reassigning query here, which is okay because:
         * - It's a parameter (local variable)
         * - Not mutating the original string
         * - Creates a new string with the cleaned value
         */
        query = query.trim().toLocaleLowerCase();

        // ====================================================================
        // VALIDATION - Empty Query Check
        // ====================================================================
        /**
         * Prevent searching for empty strings
         * 
         * EARLY RETURN PATTERN:
         * If invalid, exit immediately (don't continue)
         * Prevents unnecessary code execution
         * 
         * WHY CHECK LENGTH?
         * - Prevents empty searches
         * - Saves API calls
         * - Better UX (no error messages needed)
         * 
         * ALTERNATIVE APPROACH:
         * if (query.length > 0) {
         *   // all the code here
         * }
         * 
         * Early return is preferred because:
         * - Less nesting
         * - Clearer intent
         * - Easier to read
         */
        if (query.length === 0) return;

        // ====================================================================
        // DUPLICATE CHECK
        // ====================================================================
        /**
         * Don't search for the same term twice in a row
         * 
         * ARRAY.includes():
         * Checks if an element exists in the array
         * ['cat', 'dog'].includes('cat') → true
         * ['cat', 'dog'].includes('bird') → false
         * 
         * WHY PREVENT DUPLICATES?
         * - Avoid duplicate entries in search history
         * - Prevent unnecessary API calls (already have results)
         * - Better UX (cleaner history)
         * 
         * CASE SENSITIVITY:
         * This works because we already converted query to lowercase
         * So "Cat" and "cat" are treated as duplicates (correct behavior)
         */
        if (previousTerms.includes(query)) return;

        // ====================================================================
        // UPDATE SEARCH HISTORY
        // ====================================================================
        /**
         * Add new term to history and limit to 8 most recent
         * 
         * BREAKDOWN:
         * [query, ...previousTerms].splice(0, 8)
         *   ↑         ↑                ↑      ↑
         *   |         |                |      └─ Keep 8 items
         *   |         |                └──────── Start at index 0
         *   |         └───────────────────────── Spread existing terms
         *   └─────────────────────────────────── New term goes first
         * 
         * STEP-BY-STEP EXAMPLE:
         * 
         * Before: previousTerms = ['dog', 'bird']
         * New query: 'cat'
         * 
         * Step 1 - Create new array with query first:
         * [query, ...previousTerms]
         * ['cat', 'dog', 'bird']
         *    ↑      ↑       ↑
         *    new    ...spread...
         * 
         * Step 2 - Limit to 8 items:
         * ['cat', 'dog', 'bird'].splice(0, 8)
         * ['cat', 'dog', 'bird']  (already less than 8, no change)
         * 
         * If we had 8 terms and added a 9th:
         * ['cat', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'].splice(0, 8)
         * ['cat', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
         *                                              └─ t8 removed (oldest)
         * 
         * SPREAD OPERATOR (...):
         * Takes all elements from an array and "spreads" them out
         * 
         * const arr = [1, 2, 3]
         * [0, ...arr, 4]  →  [0, 1, 2, 3, 4]
         * 
         * SPLICE() METHOD:
         * .splice(start, deleteCount, ...items)
         * .splice(0, 8) means:
         * - Start at index 0
         * - Keep 8 items
         * - Delete everything after
         * 
         * Returns: New array with max 8 items
         * 
         * IMMUTABILITY NOTE:
         * We're NOT mutating previousTerms directly
         * We create a NEW array and pass it to setPreviousTerms
         * This is important for React to detect the change
         */
        setPreviousTerms([query, ...previousTerms].splice(0, 8));

        // ====================================================================
        // FETCH DATA FROM API
        // ====================================================================
        /**
         * Get GIFs from the API
         * 
         * This is an async operation that:
         * - Makes HTTP request to GIPHY API
         * - Waits for response
         * - Parses and returns array of Gif objects
         * 
         * ERROR HANDLING NOTE:
         * This code doesn't have try/catch for errors
         * In production, you might want:
         * 
         * try {
         *   const gifs = await getGifsByQuery(query);
         *   setGifs(gifs);
         * } catch (error) {
         *   console.error('Failed to fetch GIFs:', error);
         *   // Show error message to user
         * }
         */
        const gifs = await getGifsByQuery(query);

        // Update the displayed GIFs with fresh results
        setGifs(gifs);

        // ====================================================================
        // CACHE THE RESULTS
        // ====================================================================
        /**
         * Store results in cache for future use
         * 
         * DIRECT MUTATION:
         * gifsCache.current[query] = gifs;
         * 
         * This directly mutates the ref object, which is okay for refs!
         * (Unlike state, which should never be mutated directly)
         * 
         * EFFECT:
         * gifsCache.current = {
         *   ...existing entries...
         *   'cat': [gif1, gif2, gif3]  ← New entry added
         * }
         * 
         * WHY CACHE HERE?
         * When user clicks this term later (via handleTermClicked),
         * we can instantly show results without another API call
         * 
         * MEMORY CONSIDERATION:
         * Cache grows with each unique search
         * In production, you might want:
         * - Limit total cache size
         * - Implement LRU (Least Recently Used) eviction
         * - Clear cache on logout
         */
        gifsCache.current[query] = gifs;

        // ====================================================================
        // DEBUG LOGGING
        // ====================================================================
        /**
         * Log cache state for debugging
         * 
         * DEVELOPMENT ONLY:
         * In production, remove console.log or use proper logging library
         * 
         * WHAT'S LOGGED:
         * {
         *   current: {
         *     'cat': [gif1, gif2, ...],
         *     'dog': [gif3, gif4, ...],
         *     ...
         *   }
         * }
         * 
         * This helps verify caching is working correctly
         */
        console.log(gifsCache);
    }

    // ========================================================================
    // HOOK RETURN VALUE
    // ========================================================================
    /**
     * Return an object with values and methods
     * 
     * OBJECT STRUCTURE:
     * {
     *   // VALUES (state)
     *   gifs: Gif[]           - Current GIFs to display
     *   previousTerms: string[] - Search history
     *   
     *   // METHODS (functions)
     *   handleSearch: (query: string) => Promise<void>
     *   handleTermClicked: (term: string) => Promise<void>
     * }
     * 
     * USAGE IN COMPONENT:
     * const { gifs, previousTerms, handleSearch, handleTermClicked } = useGif()
     *         ↑         ↑              ↑                ↑
     *         |         |              |                └─ Function
     *         |         |              └──────────────────  Function
     *         |         └─────────────────────────────────  State array
     *         └───────────────────────────────────────────  State array
     * 
     * RETURN OBJECT PATTERN:
     * This is better than returning an array like useState because:
     * ✅ Self-documenting (clear names)
     * ✅ Can destructure only what you need
     * ✅ Order doesn't matter
     * ✅ Easy to add more values later
     * 
     * ALTERNATIVE (array return):
     * return [gifs, previousTerms, handleSearch, handleTermClicked]
     * ❌ Must remember order
     * ❌ No clear names
     * ❌ Must take all values
     */
    return {
        // ====================================================================
        // VALUES - State that components can use
        // ====================================================================
        gifs,           // Array of GIF objects to display
        previousTerms,  // Array of previous search strings

        // ====================================================================
        // METHODS - Functions components can call
        // ====================================================================
        handleSearch,      // Function to perform new search
        handleTermClicked, // Function to re-run previous search
    }
}

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. CUSTOM HOOKS
//    - Extract reusable logic from components
//    - Must start with "use"
//    - Can use other hooks inside
//    - Returns values and functions
//
// 2. useState vs useRef
//    - useState: Triggers re-renders, for displayed data
//    - useRef: No re-renders, for background data
//    - Refs persist across renders
//    - Refs can be mutated directly
//
// 3. CACHING STRATEGY
//    - Store API results to avoid duplicate requests
//    - Key-value structure (Record type)
//    - Check cache before API call
//    - Balance memory vs performance
//
// 4. ASYNC/AWAIT
//    - Handle asynchronous operations cleanly
//    - Makes async code look synchronous
//    - Must mark function as async
//    - Await pauses execution until promise resolves
//
// 5. ARRAY METHODS
//    - .includes() - Check if element exists
//    - .splice() - Modify array and limit length
//    - Spread operator (...) - Copy/merge arrays
//
// 6. TYPESCRIPT GENERICS
//    - useState<Type>(initialValue)
//    - useRef<Type>(initialValue)
//    - Record<KeyType, ValueType>
//    - Type safety for complex structures
//
// 7. INPUT VALIDATION
//    - Sanitize user input (trim, lowercase)
//    - Check for empty strings
//    - Prevent duplicates
//    - Early return pattern
//
// 8. SEARCH HISTORY MANAGEMENT
//    - Keep limited history (8 items)
//    - Newest first (prepend pattern)
//    - Prevent duplicates
//
// ============================================================================
// ARCHITECTURE BENEFITS:
// ============================================================================
//
// ✅ SEPARATION OF CONCERNS
//    - Business logic separate from UI
//    - Components focus on rendering
//    - Hook focuses on data management
//
// ✅ REUSABILITY
//    - Multiple components can use this hook
//    - Logic changes don't affect components
//    - Easy to test independently
//
// ✅ SINGLE RESPONSIBILITY
//    - Hook only handles GIF logic
//    - Easy to understand and maintain
//    - Clear boundaries
//
// ✅ PERFORMANCE
//    - Caching reduces API calls
//    - useRef avoids unnecessary re-renders
//    - Early returns prevent wasted work
//
// ============================================================================
// POTENTIAL IMPROVEMENTS:
// ============================================================================
//
// 1. ERROR HANDLING
//    - Add try/catch for API failures
//    - Show error messages to user
//    - Retry logic for failed requests
//
// 2. LOADING STATES
//    - Add isLoading boolean
//    - Show spinners during fetches
//    - Disable inputs while loading
//
// 3. CACHE MANAGEMENT
//    - Limit total cache size
//    - Implement LRU eviction
//    - Add cache expiration (stale data)
//    - Persist cache to localStorage
//
// 4. DEBOUNCING
//    - Already implemented in SearchBar component
//    - Could also add here as alternative
//
// 5. CANCEL REQUESTS
//    - Use AbortController
//    - Cancel in-flight requests on new search
//    - Prevent race conditions
//
// 6. TYPESCRIPT IMPROVEMENTS
//    - Add JSDoc comments
//    - Export types for consumers
//    - Stricter error typing
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add error handling with try/catch
// 2. Add isLoading state
// 3. Implement cache size limit (max 20 entries)
// 4. Persist previousTerms to localStorage
// 5. Add cache expiration (results older than 1 hour are refetched)
// 6. Implement LRU cache eviction strategy
// 7. Add request cancellation with AbortController
// 8. Add unit tests for this hook
// ============================================================================