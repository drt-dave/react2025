// ============================================================================
// CustomHeader Component - Reusable Header Component
// ============================================================================
// This is a presentational (or "dumb") component that displays a title and
// an optional description. It doesn't manage any state or business logic.
//
// LEARNING CONCEPTS:
// - TypeScript Interfaces: Defining the shape of props
// - Optional Props: Using the '?' operator for optional properties
// - Destructuring: Extracting props directly in the function parameters
// - Conditional Rendering: Showing elements only when data exists
// - JSX Expressions: Embedding JavaScript in JSX using curly braces {}
// ============================================================================

// ============================================================================
// TYPESCRIPT INTERFACE
// ============================================================================
/**
 * Props interface defines the expected properties for CustomHeader component
 * 
 * TYPESCRIPT CONCEPTS:
 * - 'interface' is a TypeScript feature for defining object shapes
 * - It provides type checking and autocompletion in your IDE
 * - Props are validated at compile-time, catching errors before runtime
 */
interface Props {
    /**
     * title - REQUIRED property
     * The main heading text to display
     * Type: string - Must be a text value
     */
    title: string;

    /**
     * description - OPTIONAL property (notice the '?' operator)
     * A subtitle or description text below the title
     * Type: string | undefined - Can be a string or not provided at all
     * 
     * THE '?' OPERATOR:
     * When you add '?' after a property name, it makes that property optional.
     * This means:
     * - <CustomHeader title="Hello" /> ✅ Valid
     * - <CustomHeader title="Hello" description="World" /> ✅ Valid
     * - <CustomHeader description="World" /> ❌ Invalid (title is required)
     */
    description?: string;
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================
/**
 * CustomHeader - A reusable header component
 * 
 * COMPONENT CHARACTERISTICS:
 * - Presentational Component: Only concerned with how things look
 * - Stateless: Doesn't manage any internal state
 * - Reusable: Can be used anywhere in the app with different titles
 * - Type-Safe: TypeScript ensures correct props are passed
 * 
 * DESTRUCTURING IN PARAMETERS:
 * Instead of writing: (props: Props) => { const title = props.title; ... }
 * We destructure directly: ({ title, description }: Props)
 * This is cleaner and more readable.
 * 
 * @param {Props} props - The component props (destructured)
 * @returns JSX.Element - The rendered header
 */
export const CustomHeader = ({ title, description }: Props) => {
    // ========================================================================
    // COMPONENT RENDER
    // ========================================================================
    return (
        <div className="content-center">
            {/* ================================================================
                TITLE RENDERING
                ================================================================
                The {title} syntax is called a JSX expression.
                Curly braces {} allow you to embed JavaScript expressions
                inside JSX. Here, we're rendering the value of the 'title' prop.
                
                IMPORTANT:
                - {title} renders the value of the variable
                - "title" (with quotes) would render the literal text "title"
            */}
            <h1>{title}</h1>

            {/* ================================================================
                CONDITIONAL RENDERING - Short-circuit Evaluation
                ================================================================
                SYNTAX: {condition && <element>}
                
                HOW IT WORKS:
                JavaScript evaluates from left to right with &&:
                - If 'description' is truthy (exists and isn't empty), 
                  render the <p> element
                - If 'description' is falsy (undefined, null, empty string),
                  nothing is rendered
                
                EXAMPLES:
                description = "Hello"  → <p>Hello</p> is rendered
                description = ""       → Nothing is rendered (empty string is falsy)
                description = undefined → Nothing is rendered
                
                WHY USE THIS PATTERN?
                - Prevents rendering empty <p> tags when description is missing
                - Cleaner than using if/else statements
                - Common React pattern for optional content
                
                ALTERNATIVE APPROACHES:
                1. Ternary operator: {description ? <p>{description}</p> : null}
                2. If statement: Store JSX in a variable and conditionally assign it
                
                The && operator is preferred when you only want to render
                something (no "else" case needed).
            */}
            {description && <p>{description}</p>}
            {/* 
                ☝️ Read this as: "If description exists, then render <p>"
                
                BREAKDOWN:
                - 'description' is evaluated first
                - If truthy, React renders <p>{description}</p>
                - If falsy, React renders nothing (skips this expression)
            */}
        </div>
    );
};

// ============================================================================
// KEY CONCEPTS DEMONSTRATED IN THIS FILE:
// ============================================================================
//
// 1. TYPESCRIPT INTERFACES
//    - Define the "contract" for component props
//    - Catch errors at development time, not runtime
//    - Enable intelligent code completion
//
// 2. OPTIONAL PROPERTIES (?)
//    - Make props flexible by marking some as optional
//    - Component can work with or without certain props
//    - Reduces boilerplate and increases reusability
//
// 3. DESTRUCTURING
//    - Extract values from objects directly in parameters
//    - Makes code more readable and concise
//    - Common pattern in modern JavaScript/React
//
// 4. JSX EXPRESSIONS
//    - Use {} to embed JavaScript in JSX
//    - Can include variables, function calls, expressions
//    - Cannot include statements (if, for, etc.)
//
// 5. CONDITIONAL RENDERING
//    - && operator for "render if truthy"
//    - Prevents rendering empty or undefined values
//    - Keeps DOM clean and semantic
//
// 6. PRESENTATIONAL COMPONENTS
//    - Focus on UI, not logic
//    - Easy to test and reuse
//    - Receive data via props, don't fetch it themselves
//
// ============================================================================
// USAGE EXAMPLES:
// ============================================================================
//
// Example 1: With both title and description
// <CustomHeader
//     title="Welcome to My App"
//     description="The best place to find GIFs"
// />
// Renders:
// <div class="content-center">
//     <h1>Welcome to My App</h1>
//     <p>The best place to find GIFs</p>
// </div>
//
// Example 2: Title only (description is optional)
// <CustomHeader title="Simple Header" />
// Renders:
// <div class="content-center">
//     <h1>Simple Header</h1>
// </div>
//
// Example 3: This would cause a TypeScript error ❌
// <CustomHeader description="No title provided" />
// Error: Property 'title' is missing
//
// ============================================================================
// BEST PRACTICES SHOWN:
// ============================================================================
// ✅ Strong typing with TypeScript interfaces
// ✅ Clear naming (Props interface, descriptive prop names)
// ✅ Optional props for flexibility
// ✅ Conditional rendering to avoid empty elements
// ✅ Destructuring for cleaner code
// ✅ Named export for better tree-shaking
// ✅ Single responsibility (only handles header display)
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add a third optional prop called 'subtitle'
// 2. Add a 'className' prop to allow custom styling from parent
// 3. Make the description render in italic or bold
// 4. Add TypeScript documentation comments (/** */) to the interface
// ============================================================================