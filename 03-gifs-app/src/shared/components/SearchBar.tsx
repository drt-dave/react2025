// ============================================================================
// SearchBar Component - Controlled Input with Debouncing
// ============================================================================
// This component implements a search bar with several advanced React concepts:
// - Controlled inputs (React manages the input value)
// - Debouncing (delaying API calls until user stops typing)
// - Event handlers (keyboard and mouse events)
// - Side effects with useEffect
// - Cleanup functions to prevent memory leaks
//
// LEARNING CONCEPTS:
// - useState: Managing component state
// - useEffect: Performing side effects (auto-search after typing)
// - Controlled Components: React owns the input value
// - Debouncing: Performance optimization technique
// - Event Typing: TypeScript event types
// - Callback Props: Communicating from child to parent
// ============================================================================

// Import React hooks and TypeScript types
import {
    useEffect,           // Hook for side effects (runs after render)
    useState,            // Hook for managing component state
    type KeyboardEvent   // TypeScript type for keyboard events
} from "react";

// ============================================================================
// TYPESCRIPT INTERFACE
// ============================================================================
/**
 * Props interface for SearchBar component
 * 
 * This defines what data the parent component must/can pass to SearchBar
 */
interface Props {
    /**
     * placeholder - Text shown when input is empty
     * Helps users understand what to search for
     */
    placeholder: string;

    /**
     * buttonTitle - Text displayed on the search button
     */
    buttonTitle: string;

    /**
     * onQuery - Callback function that receives the search query
     * 
     * FUNCTION TYPE BREAKDOWN:
     * (query: string) => void
     *   ↑              ↑    ↑
     *   |              |    └─ Returns nothing (void)
     *   |              └────── Takes a string parameter named 'query'
     *   └─────────────────── Arrow function syntax
     * 
     * WHY THIS PATTERN?
     * This is "lifting state up" - the parent component decides what to do
     * with the search query. SearchBar just notifies when a search happens.
     */
    onQuery: (query: string) => void;
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================
/**
 * SearchBar - A controlled input component with auto-search debouncing
 * 
 * FEATURES:
 * 1. Controlled input (React manages the value)
 * 2. Auto-search after 700ms of no typing (debouncing)
 * 3. Search on Enter key press
 * 4. Search on button click
 * 
 * @param {Props} props - Component properties (destructured)
 */
export const SearchBar = ({
    placeholder = 'Buscar',  // ← DEFAULT VALUE (if parent doesn't provide one)
    buttonTitle,
    onQuery
}: Props) => {

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    /**
     * useState - React hook for managing component state
     * 
     * SYNTAX: const [stateValue, setStateFunction] = useState(initialValue)
     * 
     * - query: Current value of the input (what the user typed)
     * - setQuery: Function to update the query value
     * - '': Initial value (empty string)
     * 
     * CONTROLLED INPUT CONCEPT:
     * In a "controlled component", React owns the input value:
     * 1. User types → onChange event fires
     * 2. onChange calls setQuery with new value
     * 3. Component re-renders with new query value
     * 4. Input displays the value from state (query)
     * 
     * This creates a "single source of truth" - React state.
     */
    const [query, setQuery] = useState('');

    // ========================================================================
    // SIDE EFFECTS - AUTO-SEARCH WITH DEBOUNCING
    // ========================================================================
    /**
     * useEffect - Hook for side effects (code that runs after render)
     * 
     * WHAT IS DEBOUNCING?
     * Debouncing delays executing a function until after a user has stopped
     * performing an action. This prevents excessive API calls while typing.
     * 
     * EXAMPLE WITHOUT DEBOUNCING:
     * User types "cat" → 3 API calls ('c', 'ca', 'cat') ❌ Wasteful!
     * 
     * EXAMPLE WITH DEBOUNCING (700ms):
     * User types "cat" quickly → Wait 700ms → 1 API call ('cat') ✅ Efficient!
     * 
     * HOW THIS WORKS:
     * 1. User types a character
     * 2. query state updates
     * 3. useEffect runs because query changed
     * 4. setTimeout schedules onQuery to run in 700ms
     * 5. If user types again before 700ms:
     *    - useEffect runs again
     *    - Cleanup function cancels previous timeout
     *    - New timeout is scheduled
     * 6. After 700ms of no typing, onQuery finally executes
     */
    useEffect(() => {
        // Schedule the search to run in 700 milliseconds
        const timeoutId = setTimeout(() => {
            onQuery(query)  // Call parent's onQuery function with current query
        }, 700);

        // ====================================================================
        // CLEANUP FUNCTION
        // ====================================================================
        /**
         * This function runs BEFORE the next effect and when component unmounts
         * 
         * WHY IS CLEANUP NECESSARY?
         * Without cleanup, if the user types "hello":
         * - 'h' → timeout scheduled (700ms)
         * - 'e' → timeout scheduled (700ms) [first timeout still running!]
         * - 'l' → timeout scheduled (700ms) [two timeouts running!]
         * - 'l' → timeout scheduled (700ms) [three timeouts running!]
         * - 'o' → timeout scheduled (700ms) [four timeouts running!]
         * Result: 5 API calls for "hello" ❌
         * 
         * WITH CLEANUP:
         * - 'h' → timeout scheduled
         * - 'e' → cancel previous timeout, schedule new one
         * - 'l' → cancel previous timeout, schedule new one
         * - 'l' → cancel previous timeout, schedule new one
         * - 'o' → cancel previous timeout, schedule new one
         * - After 700ms → 1 API call for "hello" ✅
         * 
         * MEMORY LEAK PREVENTION:
         * If the component unmounts (user navigates away) while a timeout
         * is pending, the cleanup function cancels it, preventing:
         * - Calling functions on unmounted components (React error)
         * - Memory leaks from orphaned timers
         */
        return () => {
            clearTimeout(timeoutId);  // Cancel the scheduled timeout
        };

        // ====================================================================
        // DEPENDENCY ARRAY
        // ====================================================================
        /**
         * [query, onQuery] - Dependencies array
         * 
         * WHEN DOES THIS EFFECT RUN?
         * - On initial render (component mounts)
         * - Whenever 'query' changes (user types)
         * - Whenever 'onQuery' changes (rare, but possible if parent re-creates it)
         * 
         * IMPORTANT RULE:
         * Every value from the component scope that's used inside the effect
         * MUST be in the dependencies array. ESLint will warn you if you forget.
         * 
         * WHY?
         * To ensure the effect always uses the latest values and doesn't
         * reference stale data from previous renders.
         */
    }, [query, onQuery])

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    /**
     * handleSearch - Manually triggers a search
     * 
     * This is called when:
     * - User clicks the search button
     * - User presses Enter key (via handleKeyDown)
     * 
     * CALLBACK PATTERN:
     * This function calls the parent's onQuery function, passing the current
     * query. This is how child components communicate with parents in React.
     * 
     * DATA FLOW:
     * User Action → handleSearch → onQuery (parent) → Parent updates state
     */
    const handleSearch = () => {
        onQuery(query);  // Send current search query to parent
    };

    /**
     * handleKeyDown - Detects Enter key press
     * 
     * TYPESCRIPT EVENT TYPING:
     * KeyboardEvent<HTMLInputElement>
     *        ↑               ↑
     *        |               └─ The type of element (input)
     *        └───────────────── The type of event (keyboard)
     * 
     * This gives us TypeScript autocomplete for:
     * - event.key
     * - event.target.value
     * - event.preventDefault()
     * - etc.
     * 
     * WHY THIS FUNCTION?
     * Better UX - users expect Enter key to submit search without clicking
     * 
     * @param event - Keyboard event object from React
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // Check if the pressed key is Enter
        if (event.key === 'Enter') {
            handleSearch();  // Trigger search immediately (bypasses debounce)
        }
    }

    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <div className="search-container">
            {/* ================================================================
                CONTROLLED INPUT
                ================================================================
                This input is "controlled" by React state. Notice three things:
                
                1. value={query}
                   The input always displays the value from state
                   React owns the value, not the DOM
                
                2. onChange={(event) => setQuery(event.target.value)}
                   When user types, update state with the new value
                   event.target.value contains what the user typed
                   
                3. onKeyDown={handleKeyDown}
                   Listen for keyboard events (specifically Enter key)
                
                WHY CONTROLLED INPUTS?
                - Single source of truth (React state)
                - Easy to validate, format, or transform input
                - Can programmatically set the value
                - Easier to test
                
                ALTERNATIVE - UNCONTROLLED INPUT (not used here):
                <input type="text" ref={inputRef} />
                Then use inputRef.current.value to get the value
            */}
            <input
                type="text"                          // HTML input type
                placeholder={placeholder}            // Show hint text when empty
                value={query}                        // Display value from state
                onChange={(event) => setQuery(event.target.value)}
                // ↑ Update state when user types
                // event.target.value = the new text in the input

                onKeyDown={handleKeyDown}            // Handle Enter key press
            />

            {/* ================================================================
                SEARCH BUTTON
                ================================================================
                Simple button that triggers handleSearch when clicked
            */}
            <button onClick={handleSearch}>
                {buttonTitle}  {/* Display button text from props */}
            </button>
        </div>
    )
}

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. CONTROLLED COMPONENTS
//    - React state is the "single source of truth"
//    - Input value is always in sync with state
//    - More predictable and easier to manipulate
//
// 2. DEBOUNCING
//    - Delay expensive operations (like API calls)
//    - Improve performance and reduce server load
//    - Better user experience (no lag while typing)
//
// 3. useEffect HOOK
//    - Run side effects after render
//    - React to state changes
//    - Clean up side effects to prevent memory leaks
//
// 4. CLEANUP FUNCTIONS
//    - Cancel pending operations before new ones start
//    - Prevent memory leaks when component unmounts
//    - Critical for timers, subscriptions, and async operations
//
// 5. EVENT HANDLING
//    - onChange: React to user input
//    - onClick: React to button clicks
//    - onKeyDown: React to keyboard input
//    - TypeScript provides type safety for events
//
// 6. TYPESCRIPT EVENT TYPES
//    - KeyboardEvent<HTMLInputElement>
//    - MouseEvent<HTMLButtonElement>
//    - ChangeEvent<HTMLInputElement>
//    - Provides autocomplete and type checking
//
// 7. CALLBACK PROPS
//    - Pass functions from parent to child
//    - Child calls function to notify parent
//    - "Lifting state up" pattern
//
// 8. DEFAULT PARAMETERS
//    - placeholder = 'Buscar'
//    - Provide fallback values for optional props
//
// ============================================================================
// COMMON PITFALLS TO AVOID:
// ============================================================================
//
// ❌ Forgetting cleanup in useEffect
//    Result: Memory leaks, duplicate API calls
//
// ❌ Missing dependencies in useEffect array
//    Result: Stale closures, bugs with old data
//
// ❌ Not typing event handlers properly
//    Result: No autocomplete, potential runtime errors
//
// ❌ Using uncontrolled inputs when controlled is better
//    Result: Harder to validate, test, and manage
//
// ============================================================================
// PERFORMANCE OPTIMIZATIONS USED:
// ============================================================================
//
// ✅ Debouncing (700ms delay before search)
//    Reduces API calls by ~90% for typical typing
//
// ✅ Cleanup functions
//    Prevents multiple simultaneous API calls
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add a "Clear" button that resets the query to empty string
// 2. Change debounce time to 1000ms and observe the difference
// 3. Add a loading spinner that shows during the 700ms wait
// 4. Add input validation (e.g., minimum 3 characters)
// 5. Add a character counter showing remaining characters
// 6. Implement a search history dropdown
// ============================================================================