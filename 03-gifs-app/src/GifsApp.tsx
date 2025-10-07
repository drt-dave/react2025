// ============================================================================
// GifsApp Component - Main Application Component
// ============================================================================
// This is the main component of the GIF search application. It orchestrates
// all the child components and manages the application's state through a
// custom hook.
//
// LEARNING CONCEPTS:
// - Component Composition: Breaking down the UI into smaller, reusable pieces
// - Custom Hooks: Separating business logic from UI components
// - Props: Passing data and functions to child components
// - TypeScript: Type safety for function parameters
// ============================================================================

// Import all necessary components from their respective locations
import { CustomHeader } from './shared/components/CustomHeader'
import { SearchBar } from './shared/components/SearchBar'
import { PreviousSearches } from './gifs/components/PreviousSearches'
import { GifList } from './gifs/components/GifList'

// Import the custom hook that manages all the GIF-related logic
import { useGif } from './gifs/hooks/useGif'

/**
 * GifsApp - Main application component
 * 
 * This component serves as the container for the entire GIF search application.
 * It uses the useGif custom hook to manage state and business logic, keeping
 * this component focused solely on rendering the UI.
 * 
 * COMPONENT STRUCTURE:
 * 1. CustomHeader - Displays the app title and description
 * 2. SearchBar - Input field for searching GIFs
 * 3. PreviousSearches - Shows previous search terms as clickable labels
 * 4. GifList - Displays the grid of GIF results
 * 
 * @returns JSX.Element - The complete application UI
 */
export const GifsApp = () => {
    // ========================================================================
    // STATE MANAGEMENT using Custom Hook
    // ========================================================================
    // The useGif hook encapsulates all the state and logic for:
    // - Storing the list of GIFs from the API
    // - Keeping track of previous search terms
    // - Handling new searches
    // - Handling clicks on previous search terms
    //
    // This is a common React pattern called "Custom Hooks" that allows you
    // to reuse stateful logic across different components.
    // ========================================================================
    const { 
        gifs,              // Array of GIF objects fetched from the API
        previousTerms,     // Array of previous search terms (strings)
        handleSearch,      // Function to perform a new search
        handleTermClicked  // Function to re-search a previous term
    } = useGif();

    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <>
            {/* React Fragment (<></>) - Allows grouping multiple elements 
                without adding an extra DOM node. This is useful when you 
                don't want an unnecessary wrapper div */}

            {/* ================================================================
                HEADER SECTION
                ================================================================
                CustomHeader displays the application title and description.
                We pass data to it using "props" (properties).
                
                Props are how parent components pass data to child components
                in React. They are read-only and flow in one direction (top-down).
            */}
            <CustomHeader
                title='Buscador de gifs'                    // String prop
                description='Descubre y comparte el Gif perfecto'  // String prop
            />

            {/* ================================================================
                SEARCH BAR SECTION
                ================================================================
                SearchBar is a controlled input component that handles user input.
                
                IMPORTANT CONCEPT - Callback Functions:
                The onQuery prop receives a function that will be called when
                the user submits a search. This is called "lifting state up" -
                the child component (SearchBar) doesn't manage what happens
                with the search, it just notifies the parent (GifsApp) that
                a search was requested.
                
                TypeScript Note: (query: string) => handleSearch(query)
                We explicitly type 'query' as string to ensure type safety.
                This prevents bugs by guaranteeing only strings are passed.
            */}
            <SearchBar
                placeholder='Buscar Gif'      // Placeholder text for the input
                buttonTitle='Buscar'          // Text for the search button
                onQuery={(query: string) => handleSearch(query)}  
                // ^ Arrow function that receives the search query and passes
                //   it to our handleSearch function from the useGif hook
            />

            {/* ================================================================
                PREVIOUS SEARCHES SECTION
                ================================================================
                PreviousSearches displays clickable labels of past search terms.
                This improves UX by allowing users to quickly re-run searches.
                
                PROPS BEING PASSED:
                - searches: Array of previous search terms
                - onLabelClicked: Callback function for when a label is clicked
            */}
            <PreviousSearches
                searches={previousTerms}           // Array of strings
                onLabelClicked={handleTermClicked} // Function to handle clicks
                // When a user clicks a previous search term, this function
                // will be called with that term, triggering a new search
            />

            {/* ================================================================
                GIF RESULTS SECTION
                ================================================================
                GifList displays the grid of GIF images returned from the API.
                It receives the array of GIF objects and renders them.
                
                LEARNING NOTE:
                Even though we only pass one prop here, the component internally
                maps over the 'gifs' array to render individual GIF items.
                This is a common pattern in React called "list rendering".
            */}
            <GifList 
                gifs={gifs}  // Array of GIF objects from the API
            />
        </>
    )
}

// ============================================================================
// KEY REACT CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
// 1. COMPONENT COMPOSITION
//    - Breaking the UI into smaller, focused components
//    - Each component has a single responsibility
//
// 2. PROPS
//    - Passing data from parent to child components
//    - Passing functions as props (callback pattern)
//
// 3. CUSTOM HOOKS
//    - Extracting stateful logic into reusable functions
//    - Keeping components clean and focused on rendering
//
// 4. ONE-WAY DATA FLOW
//    - Data flows down through props
//    - Events flow up through callback functions
//
// 5. TYPESCRIPT BENEFITS
//    - Type safety on function parameters (query: string)
//    - Auto-completion and error detection in your IDE
//    - Self-documenting code through types
//
// ============================================================================
// NEXT STEPS FOR LEARNING:
// ============================================================================
// To understand this component fully, you should explore:
// 1. The useGif custom hook implementation
// 2. How each child component is structured
// 3. How the API calls work to fetch GIFs
// 4. How state updates trigger re-renders
// ============================================================================