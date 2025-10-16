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
import type { FC } from "react";
import type { Gif } from "../interface/gif.interface";

// ============================================================================
// TYPESCRIPT INTERFACE
// ============================================================================
interface Props {
    gifs: Gif[]
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================
export const GifList: FC<Props> = ({ gifs }: Props) => {

    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <div className="gifs-container">
            {gifs.map((gif) => (
                <div
                    className="gif-card"
                    key={gif.id}
                >
                    <img
                        src={gif.url}
                        alt={gif.title}
                    />

                    <h3>{gif.title}</h3>

                    <p>
                        {gif.width}x{gif.height} (1.5mb)
                    </p>
                </div>
            ))}
        </div>
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
// ==================================