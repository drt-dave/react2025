// ============================================================================
// PreviousSearches Component - Clickable Search History
// ============================================================================
// This component displays a list of previous search terms as clickable items.
// When a user clicks a term, it triggers a new search without typing.
//
// COMPONENT TYPE:
// This is a "presentational component" that:
// - Receives data via props (doesn't fetch data itself)
// - Handles user interactions via callback props
// - Focuses purely on rendering UI
// - Has no internal state
// - Is highly reusable
//
// USER EXPERIENCE:
// Instead of typing the same search again, users can:
// - See their recent searches at a glance
// - Click any term to instantly re-search
// - Quickly explore previous queries
//
// LEARNING CONCEPTS:
// - List Rendering: Using .map() to render arrays
// - Keys in Lists: Using unique identifiers for performance
// - Event Handlers: onClick with arrow functions
// - Callback Props: Communicating from child to parent
// - FC (FunctionComponent): TypeScript component typing
// - Semantic HTML: Using appropriate HTML elements (ul, li)
// - Inline Event Handlers: Creating functions inside JSX
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * Import FC (FunctionComponent) type from React
 * 
 * WHAT IS FC?
 * FC is a TypeScript generic type that represents a React functional component.
 * It provides type checking for:
 * - Props
 * - Return type (must be valid JSX)
 * - Optional children prop
 * 
 * SYNTAX:
 * FC<Props> where Props is your interface
 * 
 * BENEFITS:
 * ✅ Type-safe props
 * ✅ Ensures component returns valid JSX
 * ✅ Consistent component typing across codebase
 * ✅ Better IDE support and autocomplete
 * 
 * ALTERNATIVE (without FC):
 * export const PreviousSearches = ({ searches, onLabelClicked }: Props) => { }
 * 
 * Both are valid! This component uses FC for consistency and explicitness.
 */
import type { FC } from "react";

// ============================================================================
// TYPESCRIPT INTERFACE
// ============================================================================

/**
 * Props interface for PreviousSearches component
 * 
 * This defines the contract: what data this component needs to function
 */
interface Props {
    /**
     * searches - Array of previous search terms
     * 
     * TYPE: string[]
     * An array of strings, each representing a search term
     * 
     * EXAMPLE DATA:
     * ['cat', 'dog', 'funny', 'dance', 'meme']
     * 
     * ORDER:
     * Typically ordered newest to oldest (handled in useGif hook)
     * 
     * MAX LENGTH:
     * Limited to 8 items in useGif hook with .splice(0, 8)
     * 
     * EMPTY ARRAY:
     * If no searches yet, this will be []
     * Component will render empty list (no <li> elements)
     */
    searches: string[];

    /**
     * onLabelClicked - Callback function when a search term is clicked
     * 
     * FUNCTION SIGNATURE:
     * (term: string) => void
     *   ↑        ↑       ↑
     *   |        |       └─ Returns nothing
     *   |        └───────── Parameter: the clicked search term
     *   └────────────────── Arrow function
     * 
     * PURPOSE:
     * This is the "callback props" pattern - the parent component
     * (GifsApp) passes down a function that the child (this component)
     * can call when something happens (a click).
     * 
     * DATA FLOW:
     * 1. User clicks "cat" in the list
     * 2. This component calls: onLabelClicked('cat')
     * 3. Parent (GifsApp) receives the call via handleTermClicked
     * 4. Parent triggers a new search for "cat"
     * 
     * WHY THIS PATTERN?
     * - "Lifting state up" - parent controls what happens
     * - This component doesn't need to know about API calls
     * - Makes component reusable (works with any callback)
     * - Single Responsibility: this component only displays and notifies
     * 
     * ALTERNATIVE NAMES:
     * Could be called: onTermClick, handleTermSelect, onSearchClick
     * The "on" prefix is convention for event handler props
     */
    onLabelClicked: (term: string) => void;
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

/**
 * PreviousSearches - Displays clickable list of recent search terms
 * 
 * COMPONENT SIGNATURE:
 * export const PreviousSearches: FC<Props> = ({ searches, onLabelClicked }) => { }
 *   ↑      ↑           ↑            ↑     ↑         ↑              ↑
 *   |      |           |            |     |         |              └─ Destructured prop
 *   |      |           |            |     |         └──────────────── Destructured prop
 *   |      |           |            |     └────────────────────────── Object destructuring
 *   |      |           |            └──────────────────────────────── Props type
 *   |      |           └───────────────────────────────────────────── Generic type parameter
 *   |      └───────────────────────────────────────────────────────── Component name
 *   └──────────────────────────────────────────────────────────────── Export for use elsewhere
 * 
 * DESTRUCTURING IN PARAMETERS:
 * Instead of:
 * (props: Props) => { 
 *   const searches = props.searches;
 *   const onLabelClicked = props.onLabelClicked;
 * }
 * 
 * We use:
 * ({ searches, onLabelClicked }: Props) => { }
 * 
 * BENEFITS:
 * ✅ Less code
 * ✅ More readable
 * ✅ Direct access to props
 * ✅ Clear what props are used
 * 
 * @param {Props} props - Component properties (destructured)
 * @returns JSX.Element - The rendered search history list
 */
export const PreviousSearches: FC<Props> = ({ searches, onLabelClicked }) => {

    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <div className="previous-searches">
            {/* ================================================================
                SECTION HEADING
                ================================================================
                Using <h2> for semantic HTML
                Tells browsers and screen readers this is a section heading
                
                ACCESSIBILITY:
                - Screen readers announce: "Heading level 2: Búsquedas previas"
                - Helps users navigate page structure
                - Important for SEO
                
                HEADING HIERARCHY:
                <h1> - Main page title (probably in CustomHeader)
                <h2> - Major sections (this one, and maybe "Results")
                <h3> - Sub-sections (GIF titles in GifList)
            */}
            <h2>Búsquedas previas</h2>

            {/* ================================================================
                UNORDERED LIST
                ================================================================
                Using <ul> (unordered list) for semantic HTML
                
                WHY <ul> INSTEAD OF <div>?
                ✅ Semantic meaning: "This is a list of items"
                ✅ Screen readers announce: "List with X items"
                ✅ Built-in list styling (bullets, though CSS may override)
                ✅ Better accessibility
                ✅ Proper document structure
                
                ALTERNATIVES:
                - <ol> (ordered list) - if order matters (1, 2, 3...)
                - <div> - less semantic, but works
                
                For search history, <ul> is appropriate because:
                - It's a collection of related items
                - Order doesn't indicate ranking (just recency)
                - Semantically correct for this use case
            */}
            <ul className="previous-searches-list">
                {/* ============================================================
                    LIST RENDERING WITH .map()
                    ============================================================
                    
                    Transform the searches array into <li> elements
                    
                    BREAKDOWN:
                    searches.map((term) => ( ... ))
                       ↑       ↑    ↑      ↑
                       |       |    |      └─ JSX to return
                       |       |    └──────── Current element (one search term string)
                       |       └───────────── Arrow function parameter
                       └───────────────────── Array to iterate over
                    
                    HOW IT WORKS:
                    If searches = ['cat', 'dog', 'bird']
                    
                    React calls the function 3 times:
                    1. term = 'cat'  → <li key="cat" onClick={...}>cat</li>
                    2. term = 'dog'  → <li key="dog" onClick={...}>dog</li>
                    3. term = 'bird' → <li key="bird" onClick={...}>bird</li>
                    
                    Result: 3 <li> elements rendered in the DOM
                    
                    EMPTY ARRAY HANDLING:
                    If searches = []
                    - .map() returns empty array
                    - No <li> elements rendered
                    - User sees just the heading
                    - Could add: {searches.length === 0 && <p>No searches yet</p>}
                */}
                {searches.map((term) => (
                    <li
                        /**
                         * KEY PROP - CRITICAL FOR REACT PERFORMANCE
                         * 
                         * SYNTAX:
                         * key={term}
                         * 
                         * WHY KEYS ARE NECESSARY:
                         * React uses keys to identify which items have changed,
                         * been added, or removed. Without keys, React would
                         * re-render the entire list on every change.
                         * 
                         * USING STRING AS KEY:
                         * key={term}
                         * 
                         * IS THIS SAFE?
                         * In this case, YES, because:
                         * ✅ Search terms are unique (useGif prevents duplicates)
                         * ✅ Terms are stable (don't change once added)
                         * ✅ Simple string values
                         * 
                         * WHY NOT INDEX?
                         * key={index} would be problematic because:
                         * ❌ If list reorders, keys don't match items
                         * ❌ If item is removed, indices shift
                         * ❌ React thinks different items changed
                         * 
                         * EXAMPLE OF PROBLEM WITH INDEX:
                         * Before remove: ['cat', 'dog', 'bird']
                         *   <li key={0}>cat</li>
                         *   <li key={1}>dog</li>
                         *   <li key={2}>bird</li>
                         * 
                         * After removing 'dog': ['cat', 'bird']
                         *   <li key={0}>cat</li>  ✅ Same
                         *   <li key={1}>bird</li> ❌ Changed! Was 'dog', now 'bird'
                         * 
                         * React thinks: "Item at index 1 changed from dog to bird"
                         * Unnecessary re-render!
                         * 
                         * WITH STABLE KEY (term):
                         * Before: 
                         *   <li key="cat">cat</li>
                         *   <li key="dog">dog</li>
                         *   <li key="bird">bird</li>
                         * 
                         * After removing 'dog':
                         *   <li key="cat">cat</li>   ✅ Same key
                         *   <li key="bird">bird</li> ✅ Same key
                         * 
                         * React knows: "dog was removed, cat and bird are unchanged"
                         * Optimal re-render!
                         * 
                         * WHEN IS INDEX OKAY?
                         * Only when:
                         * - List never reorders
                         * - Items never removed from middle
                         * - Items never added to middle
                         * - List is purely static
                         */
                        key={term}

                        /**
                         * onClick EVENT HANDLER
                         * 
                         * SYNTAX:
                         * onClick={() => onLabelClicked(term)}
                         *    ↑      ↑           ↑          ↑
                         *    |      |           |          └─ Current term from .map()
                         *    |      |           └──────────── Parent's callback function
                         *    |      └──────────────────────── Arrow function
                         *    └─────────────────────────────── React event prop
                         * 
                         * WHY ARROW FUNCTION?
                         * We NEED the arrow function wrapper because we want to
                         * pass the 'term' parameter to onLabelClicked.
                         * 
                         * ❌ WRONG - Would call immediately on render:
                         * onClick={onLabelClicked(term)}
                         * 
                         * This executes the function during render, not on click!
                         * Result: All searches trigger immediately when page loads
                         * 
                         * ✅ CORRECT - Creates a function to call later:
                         * onClick={() => onLabelClicked(term)}
                         * 
                         * This creates a NEW function that will be called when
                         * the user clicks. That function then calls onLabelClicked(term).
                         * 
                         * EXECUTION FLOW:
                         * 1. Component renders
                         * 2. Arrow function is created but NOT executed
                         * 3. User clicks the <li>
                         * 4. React calls the arrow function
                         * 5. Arrow function calls onLabelClicked(term)
                         * 6. Parent's handleTermClicked receives the term
                         * 7. Parent triggers new search
                         * 
                         * CLOSURE CONCEPT:
                         * Each arrow function "closes over" the 'term' variable
                         * from its iteration of .map(). This is called a closure.
                         * 
                         * Example with 3 terms:
                         * - First <li>: () => onLabelClicked('cat')
                         * - Second <li>: () => onLabelClicked('dog')
                         * - Third <li>: () => onLabelClicked('bird')
                         * 
                         * Each function remembers its specific 'term' value!
                         * 
                         * PERFORMANCE CONSIDERATION:
                         * Creating a new function on every render can impact
                         * performance for large lists (1000+ items).
                         * 
                         * For small lists (like 8 search terms), this is fine.
                         * 
                         * FOR LARGE LISTS, OPTIMIZE WITH:
                         * - Extract to separate component with React.memo
                         * - Use useCallback in parent
                         * - Pass id and use data-attribute
                         * 
                         * ALTERNATIVE APPROACH (less common):
                         * onClick={(e) => onLabelClicked(e.currentTarget.textContent)}
                         * 
                         * But using the 'term' variable is:
                         * ✅ More explicit
                         * ✅ More reliable
                         * ✅ Doesn't depend on DOM content
                         */
                        onClick={() => onLabelClicked(term)}
                    >
                        {/* ====================================================
                            DISPLAY THE SEARCH TERM
                            ====================================================
                            
                            JSX EXPRESSION:
                            {term}
                            
                            Displays the current search term from the iteration
                            
                            EXAMPLES:
                            If term = 'cat'  → Displays: cat
                            If term = 'dog'  → Displays: dog
                            
                            COULD ALSO DO:
                            - Uppercase: {term.toUpperCase()} → CAT
                            - Capitalized: {term.charAt(0).toUpperCase() + term.slice(1)} → Cat
                            - With icon: 🔍 {term}
                            - With badge: {term} <span>(x)</span>
                            
                            ACCESSIBILITY:
                            Screen reader announces: "cat, button" (list item)
                            Users know it's clickable from:
                            - Mouse cursor change (CSS: cursor: pointer)
                            - Visual styling (CSS)
                            - Semantic list structure
                            
                            BEST PRACTICE - MAKE IT A BUTTON:
                            For better accessibility, could use:
                            <li key={term}>
                              <button onClick={() => onLabelClicked(term)}>
                                {term}
                              </button>
                            </li>
                            
                            Benefits:
                            ✅ Keyboard accessible (Tab, Enter, Space)
                            ✅ Screen readers announce as button
                            ✅ Clear interactive element
                            ✅ Semantic HTML
                            
                            Current approach (onClick on <li>) works but:
                            ⚠️ Not keyboard accessible without tabIndex
                            ⚠️ Not announced as interactive by screen readers
                            ⚠️ Less semantic
                        */}
                        {term}
                    </li>
                ))}
                {/* 
                    CLOSING .map()
                    
                    After .map() completes, we have an array of <li> elements
                    React automatically renders all elements in the array
                    
                    FINAL RENDERED HTML:
                    <ul class="previous-searches-list">
                      <li key="cat">cat</li>
                      <li key="dog">dog</li>
                      <li key="bird">bird</li>
                    </ul>
                    
                    (Keys don't appear in actual DOM - they're just for React)
                */}
            </ul>
        </div>
    )
}

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. PRESENTATIONAL COMPONENT
//    - No state management (stateless)
//    - Only displays data from props
//    - Calls callbacks for interactions
//    - Highly reusable and testable
//
// 2. LIST RENDERING
//    - .map() to transform data into JSX
//    - Each item becomes a list element
//    - React renders the returned array
//
// 3. KEYS IN LISTS
//    - Unique identifiers for React's reconciliation
//    - Using stable values (term) not indices
//    - Critical for performance
//    - Helps React track changes
//
// 4. EVENT HANDLERS WITH PARAMETERS
//    - Arrow function wrapper to pass parameters
//    - onClick={() => callback(param)}
//    - Closure captures the parameter
//    - Each handler remembers its specific value
//
// 5. CALLBACK PROPS
//    - Child notifies parent through function props
//    - "Lifting state up" pattern
//    - Parent controls behavior
//    - Component stays flexible
//
// 6. FC (FunctionComponent) TYPE
//    - TypeScript typing for components
//    - Type-safe props
//    - Ensures valid JSX return
//
// 7. SEMANTIC HTML
//    - <ul> for lists
//    - <li> for list items
//    - <h2> for section headings
//    - Better accessibility and SEO
//
// 8. DESTRUCTURING
//    - Extract props in parameters
//    - Cleaner code
//    - Clear dependencies
//
// ============================================================================
// COMMON PATTERNS AND ALTERNATIVES:
// ============================================================================
//
// 1. EMPTY STATE HANDLING
//    {searches.length === 0 ? (
//      <p>No previous searches</p>
//    ) : (
//      <ul>...</ul>
//    )}
//
// 2. LIMITED DISPLAY WITH "SHOW MORE"
//    {searches.slice(0, 5).map((term) => ...)}
//    {searches.length > 5 && <button>Show more</button>}
//
// 3. REMOVE BUTTON FOR EACH TERM
//    <li key={term}>
//      {term}
//      <button onClick={() => onRemove(term)}>×</button>
//    </li>
//
// 4. BETTER ACCESSIBILITY WITH BUTTON
//    <li key={term}>
//      <button onClick={() => onLabelClicked(term)}>
//        {term}
//      </button>
//    </li>
//
// 5. WITH ICONS
//    <li key={term} onClick={() => onLabelClicked(term)}>
//      🔍 {term}
//    </li>
//
// 6. WITH SEARCH COUNT
//    <li key={term} onClick={() => onLabelClicked(term)}>
//      {term} <span>({term.resultCount})</span>
//    </li>
//
// 7. EXTRACTING LIST ITEM TO COMPONENT
//    const SearchTerm = ({ term, onClick }) => (
//      <li onClick={onClick}>{term}</li>
//    );
//
//    searches.map((term) => (
//      <SearchTerm
//        key={term}
//        term={term}
//        onClick={() => onLabelClicked(term)}
//      />
//    ))
//
// ============================================================================
// ACCESSIBILITY IMPROVEMENTS:
// ============================================================================
//
// CURRENT IMPLEMENTATION:
// ⚠️ List items with onClick aren't keyboard accessible
// ⚠️ Screen readers don't announce as interactive
//
// IMPROVED VERSION:
//
// <li key={term}>
//   <button
//     onClick={() => onLabelClicked(term)}
//     aria-label={`Search again for ${term}`}
//   >
//     {term}
//   </button>
// </li>
//
// OR, make <li> accessible:
//
// <li
//   key={term}
//   onClick={() => onLabelClicked(term)}
//   onKeyDown={(e) => e.key === 'Enter' && onLabelClicked(term)}
//   tabIndex={0}
//   role="button"
//   aria-label={`Search for ${term}`}
// >
//   {term}
// </li>
//
// BENEFITS:
// ✅ Keyboard navigation with Tab
// ✅ Activation with Enter/Space
// ✅ Screen readers announce as button
// ✅ ARIA label provides context
// ✅ role="button" clarifies purpose
//
// ============================================================================
// STYLING CONSIDERATIONS:
// ============================================================================
//
// CSS classes used:
// - .previous-searches (container)
// - .previous-searches-list (ul element)
//
// Common CSS for this component:
//
// .previous-searches-list {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   list-style: none;  /* Remove bullets */
//   padding: 0;
// }
//
// .previous-searches-list li {
//   padding: 0.5rem 1rem;
//   background: #f0f0f0;
//   border-radius: 20px;
//   cursor: pointer;
//   transition: background 0.2s;
// }
//
// .previous-searches-list li:hover {
//   background: #e0e0e0;
// }
//
// .previous-searches-list li:active {
//   transform: scale(0.95);
// }
//
// ============================================================================
// POTENTIAL ENHANCEMENTS:
// ============================================================================
//
// 1. ADD REMOVE FUNCTIONALITY
//    Let users remove individual search terms
//
// 2. HIGHLIGHT CURRENT SEARCH
//    Show which term is currently active
//
// 3. SORT OPTIONS
//    Sort by recency, alphabetically, or frequency
//
// 4. SEARCH COUNTS
//    Show how many results each term has
//
// 5. PERSIST TO LOCAL STORAGE
//    Save searches across browser sessions
//
// 6. CLEAR ALL BUTTON
//    Reset search history with one click
//
// 7. KEYBOARD NAVIGATION
//    Arrow keys to navigate, Enter to select
//
// 8. ANIMATIONS
//    Fade in new terms, slide out removed ones
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add empty state message when searches.length === 0
// 2. Add a "Clear all" button that calls a new callback prop
// 3. Make list items keyboard accessible with tabIndex and onKeyDown
// 4. Add a remove button (×) to each term
// 5. Highlight the most recent search with different styling
// 6. Limit display to 5 terms with "Show more" button
// 7. Add fade-in animation for new terms
// 8. Extract list item to separate component
// 9. Add search result count next to each term
// 10. Implement drag-to-reorder functionality
// ============================================================================