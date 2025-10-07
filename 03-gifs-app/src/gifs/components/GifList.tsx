// ============================================================================
// GifList Component - List Rendering with TypeScript
// ============================================================================
// This component demonstrates one of the most fundamental patterns in React:
// rendering lists of data. It takes an array of GIF objects and transforms
// them into a grid of visual cards.
//
// LEARNING CONCEPTS:
// - List Rendering: Using .map() to transform data into JSX
// - Keys in Lists: Why React needs unique identifiers
// - TypeScript FC (FunctionComponent): Typing React components
// - Interface Imports: Using custom TypeScript types
// - Props Destructuring: Multiple ways to extract props
// - Semantic HTML: Proper structure for accessibility
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================
/**
 * Import FC (FunctionComponent) type from React
 * 
 * WHAT IS FC?
 * FC is a TypeScript type provided by React that defines what a
 * functional component should look like. It's a generic type that
 * accepts a Props type parameter.
 * 
 * USING FC IS OPTIONAL:
 * You can write components two ways:
 * 
 * Option 1 (with FC):
 * export const MyComponent: FC<Props> = ({ prop1 }) => { ... }
 * 
 * Option 2 (without FC - modern approach):
 * export const MyComponent = ({ prop1 }: Props) => { ... }
 * 
 * BOTH ARE VALID! The second option is becoming more popular because:
 * - Less typing
 * - More explicit about props type
 * - No implicit 'children' prop (which can be confusing)
 * 
 * However, FC provides:
 * - Return type checking (must return JSX.Element)
 * - displayName property for debugging
 * - Some teams prefer it for consistency
 */
import type { FC } from "react";

/**
 * Import the Gif interface
 * 
 * TYPE-ONLY IMPORT:
 * 'import type' tells TypeScript this is only used for type checking,
 * not at runtime. This can improve bundle size because TypeScript
 * removes these imports during compilation.
 * 
 * THE GIF INTERFACE:
 * This defines the shape of a single GIF object. It likely looks like:
 * 
 * interface Gif {
 *   id: string;      // Unique identifier (important for keys!)
 *   url: string;     // Image source URL
 *   title: string;   // GIF title/description
 *   width: number;   // Image width in pixels
 *   height: number;  // Image height in pixels
 * }
 */
import type { Gif } from "../interface/gif.interface";

// ============================================================================
// TYPESCRIPT INTERFACE
// ============================================================================
/**
 * Props interface for GifList component
 * 
 * This component receives a single prop: an array of Gif objects
 */
interface Props {
    /**
     * gifs - Array of GIF objects to display
     * 
     * TYPE BREAKDOWN:
     * Gif[]
     *  ↑  ↑
     *  |  └─ Square brackets indicate this is an array
     *  └──── Each element in the array is a Gif object
     * 
     * EXAMPLE DATA:
     * [
     *   { id: '1', url: 'cat.gif', title: 'Funny Cat', width: 480, height: 360 },
     *   { id: '2', url: 'dog.gif', title: 'Happy Dog', width: 640, height: 480 }
     * ]
     */
    gifs: Gif[]
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================
/**
 * GifList - Displays a grid of GIF cards
 * 
 * SYNTAX BREAKDOWN:
 * export const GifList: FC<Props> = ({ gifs }: Props) => { ... }
 *                       ↑       ↑    ↑         ↑
 *                       |       |    |         └─ Props type for destructuring
 *                       |       |    └─────────── Destructure gifs from props
 *                       |       └──────────────── Generic type parameter
 *                       └──────────────────────── FunctionComponent type
 * 
 * NOTE: The Props type appears twice in this syntax:
 * 1. FC<Props> - Tells React this component accepts Props
 * 2. ({ gifs }: Props) - Tells TypeScript how to type the destructured params
 * 
 * MODERN ALTERNATIVE (you'll see both styles):
 * export const GifList = ({ gifs }: Props) => { ... }
 * 
 * Both work! The FC version is more explicit, the alternative is more concise.
 * 
 * @param {Props} props - Component properties (destructured)
 * @returns JSX.Element - The rendered grid of GIFs
 */
export const GifList: FC<Props> = ({ gifs }: Props) => {

    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <div className="gifs-container">
            {/* ================================================================
                LIST RENDERING WITH .map()
                ================================================================
                
                WHAT IS .map()?
                .map() is a JavaScript array method that transforms each
                element in an array and returns a new array.
                
                IN REACT:
                We use .map() to transform data (array of objects) into
                JSX elements (array of components/HTML).
                
                SYNTAX BREAKDOWN:
                gifs.map((gif) => ( ... ))
                  ↑       ↑        ↑
                  |       |        └─ Return JSX for each element
                  |       └────────── Current element (one Gif object)
                  └────────────────── Array we're iterating over
                
                HOW IT WORKS:
                1. React calls the function for each item in gifs array
                2. Each iteration receives one Gif object (named 'gif')
                3. Function returns JSX for that specific GIF
                4. React collects all returned JSX and renders it
                
                EXAMPLE:
                If gifs = [gif1, gif2, gif3]
                React renders:
                  <div key={gif1.id}>...</div>
                  <div key={gif2.id}>...</div>
                  <div key={gif3.id}>...</div>
                
                IMPORTANT:
                - The function inside .map() must return JSX
                - Each returned element needs a unique 'key' prop
                - You can use () parentheses for implicit return (no return keyword)
            */}
            {gifs.map((gif) => (

                {/* ============================================================
                    GIF CARD COMPONENT
                    ============================================================
                    Each GIF is displayed in its own card with:
                    - The GIF image
                    - Title
                    - Dimensions
                */}
                < div 
                    className = "gif-card" 
                    key = { gif.id }
                    {/* ========================================================
                        THE 'key' PROP - CRITICAL FOR REACT PERFORMANCE
                        ========================================================
                        
                        WHAT ARE KEYS?
                        Keys help React identify which items have changed,
                        been added, or removed. They give elements a stable
                        identity across re-renders.
                        
                        WHY ARE KEYS IMPORTANT?
                        Without keys, React has to re-render the entire list
                        when anything changes. With keys, React can:
                        - Update only the items that changed
                        - Preserve component state
                        - Maintain focus and scroll position
                        - Optimize performance dramatically
                        
                        RULES FOR KEYS:
                        ✅ Must be unique among siblings
                        ✅ Should be stable (same key for same item)
                        ✅ Should be predictable (not random)
                        ✅ Use unique IDs from your data (like gif.id)
                        
                        GOOD KEYS:
                        ✅ key={gif.id}        (unique ID from database)
                        ✅ key={user.email}    (unique email)
                        ✅ key={product.sku}   (unique SKU)
                        
                        BAD KEYS:
                        ❌ key={Math.random()}  (changes every render!)
                        ❌ key={index}          (problematic if list reorders)
                        ❌ No key              (React will warn you)
                        
                        WHY NOT USE INDEX?
                        If your list can reorder, add, or remove items,
                        using index as key causes bugs:
                        
                        Before: [
                          <Item key={0} data="A" />,  // index 0
                          <Item key={1} data="B" />,  // index 1
                          <Item key={2} data="C" />   // index 2
                        ]
                        
                        After removing "B": [
                          <Item key={0} data="A" />,  // Still index 0 ✅
                          <Item key={1} data="C" />   // Now index 1 ❌
                        ]
                        
                        React thinks item at index 1 changed from "B" to "C"
                        and re-renders it unnecessarily.
                        
                        With stable IDs:
                        Before: [
                          <Item key="id-1" data="A" />,
                          <Item key="id-2" data="B" />,
                          <Item key="id-3" data="C" />
                        ]
                        
                        After removing "B": [
                          <Item key="id-1" data="A" />,  // Same key ✅
                          <Item key="id-3" data="C" />   // Same key ✅
                        ]
                        
                        React knows exactly which item was removed.
                    */}
                >
                {/* ========================================================
                        IMAGE ELEMENT
                        ========================================================
                        Displays the actual GIF image
                        
                        IMPORTANT ATTRIBUTES:
                        - src: URL of the image
                        - alt: Description for accessibility (screen readers)
                    */}
                < img 
                        src = { gif.url }      // Image source URL
                        alt = { gif.title }    // Alternative text for accessibility
                        {/* 
                            WHY 'alt' IS IMPORTANT:
                            - Screen readers use it for visually impaired users
                            - Displayed if image fails to load
                            - SEO benefits (search engines index it)
                            - Required for accessible web applications
                            
                            GOOD ALT TEXT:
                            ✅ alt="Funny cat dancing"
                            ✅ alt={gif.title}
                            
                            BAD ALT TEXT:
                            ❌ alt=""                    (empty, not helpful)
                            ❌ alt="image"               (not descriptive)
                            ❌ alt="gif.jpg"             (filename, not content)
                        */}
                />

                {/* ========================================================
                        TITLE
                        ========================================================
                        Display the GIF's title using h3 heading
                        
                        SEMANTIC HTML:
                        Using <h3> instead of <div> or <p> tells browsers
                        and screen readers this is a heading, which:
                        - Improves accessibility
                        - Helps with SEO
                        - Creates better document structure
                    */}
                < h3 > { gif.title }</>

                    {/* ========================================================
                        METADATA
                        ========================================================
                        Display dimensions and file size
                        
                        STRING INTERPOLATION IN JSX:
                        {gif.width}x{gif.height} combines:
                        - {gif.width}  → Dynamic value from data
                        - x            → Static text
                        - {gif.height} → Dynamic value from data
                        
                        Result: "480x360" or "640x480", etc.
                        
                        TEMPLATE LITERALS ALTERNATIVE:
                        You could also write:
                        {`${gif.width}x${gif.height} (1.5mb)`}
                        
                        Both work! Choose based on readability.
                    */}
    <p>
        {gif.width}x{gif.height} (1.5mb)
        {/* 
                            NOTE: The file size is hardcoded as "1.5mb"
                            In a real app, you might want to:
                            - Get actual file size from the API
                            - Format it dynamically: {formatFileSize(gif.size)}
                            - Remove it if not available
                        */}
    </p>
                </div >
            ))
            /* 
                CLOSING THE .map()
                
                Notice the parentheses structure:
                gifs.map((gif) => (
                    <div>...</div>
                ))
                  ↑              ↑
                  |              └─ Closes the JSX return (implicit return)
                  └──────────────── Opens the JSX return
                
                PARENTHESES () vs CURLY BRACES {}:
                
                With parentheses (implicit return):
                gifs.map((gif) => (
                    <div>{gif.title}</div>
                ))
                
                With curly braces (explicit return):
                gifs.map((gif) => {
                    return <div>{gif.title}</div>
                })
                
                Both work! Parentheses are shorter for simple JSX.
                Use braces when you need to do logic before returning.
            */}
        </div >
    )
}

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. LIST RENDERING WITH .map()
//    - Transform arrays into JSX
//    - Most common pattern for displaying lists
//    - Returns a new array of React elements
//
// 2. KEYS IN LISTS
//    - Essential for React's reconciliation algorithm
//    - Must be unique among siblings
//    - Use stable IDs, not array indices (usually)
//    - Dramatically improves performance
//
// 3. FC (FunctionComponent) TYPE
//    - TypeScript type for React components
//    - Provides type safety for props
//    - Ensures correct return type
//    - Optional but helpful for beginners
//
// 4. TYPE-ONLY IMPORTS
//    - import type { ... } for types
//    - Removed during compilation
//    - Helps with bundle size
//
// 5. ARRAY METHODS IN JSX
//    - .map() for transforming data
//    - .filter() to conditionally show items
//    - .sort() to order items
//    - Must return JSX elements
//
// 6. SEMANTIC HTML
//    - <h3> for headings
//    - <img alt="..."> for accessibility
//    - Proper structure helps everyone
//
// 7. STRING INTERPOLATION
//    - Mix static and dynamic content
//    - {value}x{value} pattern
//    - Alternative: template literals `${}`
//
// ============================================================================
// COMMON PATTERNS AND VARIATIONS:
// ============================================================================
//
// 1. CONDITIONAL RENDERING IN LISTS
//    {gifs.map((gif) => (
//        gif.featured && <div key={gif.id}>...</div>
//    ))}
//
// 2. FILTERING BEFORE MAPPING
//    {gifs
//        .filter(gif => gif.width > 200)
//        .map(gif => <div key={gif.id}>...</div>)
//    }
//
// 3. EMPTY STATE HANDLING
//    {gifs.length === 0 ? (
//        <p>No GIFs found</p>
//    ) : (
//        gifs.map(gif => <div key={gif.id}>...</div>)
//    )}
//
// 4. MAPPING WITH INDEX (when you need it)
//    {gifs.map((gif, index) => (
//        <div key={gif.id}>
//            <span>#{index + 1}</span>
//            <img src={gif.url} />
//        </div>
//    ))}
//
// 5. EXTRACTING TO SEPARATE COMPONENT
//    {gifs.map(gif => (
//        <GifCard key={gif.id} gif={gif} />
//    ))}
//
// ============================================================================
// PERFORMANCE CONSIDERATIONS:
// ============================================================================
//
// ✅ GOOD PRACTICES:
// - Use unique, stable keys (gif.id)
// - Keep mapped components simple
// - Consider virtualization for long lists (react-window)
// - Extract complex card logic to separate component
//
// ❌ AVOID:
// - Creating functions inside .map()
// - Complex logic inside .map()
// - Using array index as key (in dynamic lists)
// - Mapping without keys
//
// ============================================================================
// ACCESSIBILITY CONSIDERATIONS:
// ============================================================================
//
// ✅ This component does well:
// - Uses alt text on images
// - Semantic HTML (h3 for titles)
// - Proper heading hierarchy
//
// 🔄 Could improve:
// - Add ARIA labels for screen readers
// - Add loading states for images
// - Add error handling for failed images
// - Make cards keyboard navigable (if interactive)
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add an empty state when gifs array is empty
// 2. Extract GifCard to a separate component
// 3. Add a loading skeleton while images load
// 4. Implement lazy loading for images
// 5. Add click handler to view GIF in full screen
// 6. Sort GIFs by width before mapping
// 7. Add favorite button to each card
// 8. Implement infinite scroll with pagination
// ============================================================================