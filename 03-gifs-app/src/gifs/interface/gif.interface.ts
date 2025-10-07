// ============================================================================
// Gif Interface - Application Data Model
// ============================================================================
// This file defines the TypeScript interface for GIF objects in our application.
// An interface is a "contract" that describes the shape of data.
//
// WHAT IS A TYPESCRIPT INTERFACE?
// An interface is a way to define the structure of an object. It tells
// TypeScript (and developers) exactly what properties an object should have,
// what types those properties are, and whether they're required or optional.
//
// WHY USE INTERFACES?
// ✅ Type Safety - Catch errors at compile time, not runtime
// ✅ Autocomplete - IDEs know what properties exist
// ✅ Documentation - Self-documenting code
// ✅ Refactoring - Change once, TypeScript finds all usages
// ✅ Consistency - Ensures all GIF objects have the same shape
// ✅ Collaboration - Team knows exactly what data looks like
//
// INTERFACE vs TYPE:
// You might also see "type Gif = { ... }" which is similar.
// For simple object shapes, interface and type are interchangeable.
// 
// When to use interface:
// - Object shapes
// - Can be extended
// - Better error messages
// 
// When to use type:
// - Unions (string | number)
// - Tuples [string, number]
// - Complex types
//
// LEARNING CONCEPTS:
// - TypeScript Interfaces
// - Data Modeling
// - Type Annotations
// - Primitive Types (string, number)
// - Object Shape Definition
// - Export/Import Modules
// - Separation of Concerns
// ============================================================================

// ============================================================================
// INTERFACE DEFINITION
// ============================================================================

/**
 * Gif Interface - Represents a GIF image in our application
 * 
 * WHAT THIS INTERFACE DOES:
 * Defines the exact structure of GIF objects used throughout the app.
 * Any object that claims to be a Gif MUST have these 5 properties
 * with the exact types specified.
 * 
 * WHERE IT'S USED:
 * - useState<Gif[]> in useGif hook
 * - Function return types: Promise<Gif[]>
 * - Component props: gifs: Gif[]
 * - Array transformations: response.data.map(): Gif[]
 * 
 * WHY THIS SPECIFIC SHAPE?
 * This is OUR application's simplified format. The GIPHY API returns
 * much more data (~30+ properties), but we only need these 5.
 * 
 * DESIGN DECISION:
 * By creating our own interface separate from the API response,
 * we decouple our app from the external API. If GIPHY changes
 * their response format, we only need to update the transformation
 * in get-gifs-by-query.action.ts
 * 
 * DATA FLOW:
 * GIPHY API Response → GiphyResponse interface → Transform → Gif interface
 *   (30+ properties)         (full API)            (.map())    (5 properties)
 * 
 * EXPORT KEYWORD:
 * Makes this interface available to other files via import
 */
export interface Gif {

    // ========================================================================
    // REQUIRED PROPERTIES
    // ========================================================================
    // All properties in this interface are required (no '?' operator)
    // Every Gif object MUST have all 5 properties or TypeScript will error
    // ========================================================================

    /**
     * id - Unique identifier for the GIF
     * 
     * TYPE: string
     * A text value that uniquely identifies this GIF
     * 
     * EXAMPLES:
     * - "3o7btPCcdNniyf0ArS"
     * - "xT9IgG50Fb7Mi0prBC"
     * - "l0HlvtIPa0G0b6kgM"
     * 
     * WHY STRING?
     * - GIPHY uses alphanumeric IDs
     * - Not sequential numbers
     * - Can contain letters and numbers
     * - Never used for math, so string is appropriate
     * 
     * PURPOSE:
     * - Primary key (database concept)
     * - Used as React key in lists: key={gif.id}
     * - Can construct direct links: https://giphy.com/gifs/{id}
     * - Ensures uniqueness in collections
     * 
     * CRITICAL FOR REACT:
     * This is what we use for the 'key' prop when rendering lists:
     * {gifs.map((gif) => <div key={gif.id}>...</div>)}
     * 
     * WHY NOT NUMBER?
     * Could be number if IDs were numeric, but GIPHY uses strings
     * 
     * ALTERNATIVE NAMES:
     * Could be: gifId, uniqueId, identifier
     * Using 'id' is conventional and concise
     */
    id: string;

    /**
     * title - Descriptive text for the GIF
     * 
     * TYPE: string
     * Human-readable description or name of the GIF
     * 
     * EXAMPLES:
     * - "Cat Dancing GIF by GIPHY Studios"
     * - "Happy Dog"
     * - "Funny Meme"
     * - "" (empty string - some GIFs have no title)
     * 
     * WHY STRING?
     * - Text data
     * - Human-readable
     * - Can be empty
     * - Variable length
     * 
     * PURPOSE:
     * - Display to users (shown under GIF)
     * - Accessibility (alt text for images)
     * - SEO (search engines index it)
     * - User context (what is this GIF about?)
     * 
     * USED IN:
     * - <h3>{gif.title}</h3> in GifList component
     * - <img alt={gif.title} /> for accessibility
     * - Search results display
     * 
     * EDGE CASES:
     * Some GIFs have empty titles (""). Your code should handle this:
     * - Display placeholder: {gif.title || 'Untitled GIF'}
     * - Don't render if empty: {gif.title && <h3>{gif.title}</h3>}
     * 
     * COULD BE OPTIONAL:
     * title?: string;
     * But we chose required to keep interface simple
     * Empty string ("") is used instead of undefined
     * 
     * ALTERNATIVE NAMES:
     * Could be: name, description, caption, label
     */
    title: string;

    /**
     * url - Direct link to the GIF image file
     * 
     * TYPE: string
     * Full HTTP(S) URL pointing to the actual GIF file
     * 
     * EXAMPLES:
     * - "https://media0.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif"
     * - "https://media1.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
     * - "https://media2.giphy.com/media/l0HlvtIPa0G0b6kgM/200.gif"
     * 
     * WHY STRING?
     * - URLs are always text
     * - Variable length
     * - Contains protocol (https://), domain, path
     * 
     * PURPOSE:
     * - Source for <img> element: <img src={gif.url} />
     * - What gets displayed to users
     * - Direct link to the image file
     * 
     * URL STRUCTURE:
     * https://media0.giphy.com/media/{id}/{filename}.gif
     *   ↑         ↑               ↑      ↑         ↑
     *   |         |               |      |         └─ File extension
     *   |         |               |      └─────────── Filename (varies)
     *   |         |               └────────────────── GIF ID
     *   |         └────────────────────────────────── Subdomain (0, 1, 2...)
     *   └──────────────────────────────────────────── Protocol
     * 
     * GIPHY CDN:
     * GIPHY uses multiple subdomains (media0, media1, media2...) for
     * load balancing and faster delivery (CDN = Content Delivery Network)
     * 
     * FILE FORMATS:
     * - .gif - Original GIF format
     * - .mp4 - Video version (smaller, better performance)
     * - .webp - Modern image format (better compression)
     * 
     * We use .gif but could optimize by using .mp4:
     * url: gif.images.original.mp4
     * 
     * USED IN:
     * <img src={gif.url} alt={gif.title} />
     * 
     * VALIDATION:
     * In production, might want to validate:
     * - Starts with https://
     * - Is from giphy.com domain
     * - Actually loads (handle 404 errors)
     * 
     * ALTERNATIVE NAMES:
     * Could be: imageUrl, src, source, link, href
     */
    url: string;

    /**
     * width - Image width in pixels
     * 
     * TYPE: number
     * Numeric value representing horizontal size in pixels
     * 
     * EXAMPLES:
     * - 480
     * - 640
     * - 320
     * - 1920
     * 
     * WHY NUMBER (not string)?
     * - Used for mathematical operations
     * - Easier to compare: width > 500
     * - No need to parse: Number(width)
     * - Type safety for calculations
     * 
     * NOTE ON API:
     * GIPHY API returns this as a STRING: "480"
     * We convert it to NUMBER in the transformation:
     * width: Number(gif.images.original.width)
     * 
     * PURPOSE:
     * - Display image dimensions to users
     * - Calculate aspect ratios
     * - Responsive image sizing
     * - Layout calculations
     * - Filter by size (future feature)
     * 
     * USED IN:
     * <p>{gif.width}x{gif.height} (1.5mb)</p>
     * 
     * POSSIBLE CALCULATIONS:
     * - Aspect ratio: width / height
     * - Is landscape: width > height
     * - Is portrait: height > width
     * - Is square: width === height
     * 
     * TYPICAL VALUES:
     * GIPHY original images range from:
     * - Min: ~200px (small GIFs)
     * - Max: ~2000px (high quality)
     * - Common: 400-800px
     * 
     * CSS USAGE:
     * Could use for explicit sizing:
     * <img 
     *   src={gif.url} 
     *   width={gif.width} 
     *   height={gif.height}
     *   style={{ maxWidth: '100%', height: 'auto' }}
     * />
     * 
     * This prevents layout shift (CLS - Core Web Vital)
     * 
     * ALTERNATIVE TYPES:
     * Could be: number | null if width might not be available
     * But GIPHY always provides dimensions
     */
    width: number;

    /**
     * height - Image height in pixels
     * 
     * TYPE: number
     * Numeric value representing vertical size in pixels
     * 
     * EXAMPLES:
     * - 360
     * - 480
     * - 240
     * - 1080
     * 
     * WHY NUMBER (not string)?
     * Same reasons as width - for calculations and comparisons
     * 
     * NOTE ON API:
     * GIPHY API returns this as a STRING: "360"
     * We convert it to NUMBER in the transformation:
     * height: Number(gif.images.original.height)
     * 
     * PURPOSE:
     * - Display image dimensions to users
     * - Calculate aspect ratios
     * - Responsive image sizing
     * - Layout calculations
     * - Determine orientation (landscape/portrait)
     * 
     * USED IN:
     * <p>{gif.width}x{gif.height} (1.5mb)</p>
     * 
     * ASPECT RATIO CALCULATIONS:
     * const aspectRatio = gif.width / gif.height;
     * 
     * Examples:
     * - 16:9 landscape: width=1920, height=1080, ratio=1.78
     * - 4:3 standard: width=640, height=480, ratio=1.33
     * - 1:1 square: width=500, height=500, ratio=1.0
     * - 9:16 portrait: width=1080, height=1920, ratio=0.56
     * 
     * CSS USAGE:
     * Using width and height prevents Cumulative Layout Shift (CLS).
     * The browser knows the space needed before the image loads.
     * 
     * RELATIONSHIP WITH WIDTH:
     * Always comes as a pair with width
     * Together they define the image's dimensions and aspect ratio
     * 
     * TYPICAL VALUES:
     * GIPHY original images:
     * - Min: ~200px
     * - Max: ~2000px
     * - Common: 300-600px
     */
    height: number;
}

// ============================================================================
// USAGE EXAMPLES THROUGHOUT THE APPLICATION:
// ============================================================================
//
// 1. STATE MANAGEMENT (useGif.tsx):
// const [gifs, setGifs] = useState<Gif[]>([]);
// TypeScript knows: gifs is an array of Gif objects
//
// 2. FUNCTION PARAMETERS:
// const displayGif = (gif: Gif) => {
//   console.log(gif.id, gif.title);
// };
//
// 3. FUNCTION RETURN TYPES:
// const getGifsByQuery = async (query: string): Promise<Gif[]> => {
//   // ... fetch and transform
//   return transformedGifs; // Must be Gif[]
// };
//
// 4. COMPONENT PROPS:
// interface Props {
//   gifs: Gif[];
// }
// export const GifList: FC<Props> = ({ gifs }) => { ... };
//
// 5. ARRAY METHODS:
// gifs.map((gif: Gif) => (
//   <div key={gif.id}>
//     <img src={gif.url} alt={gif.title} />
//   </div>
// ));
//
// 6. OBJECT CREATION:
// const newGif: Gif = {
//   id: '123',
//   title: 'Test',
//   url: 'https://...',
//   width: 500,
//   height: 400
// };
// TypeScript validates all 5 properties exist and have correct types
//
// ============================================================================
// TYPESCRIPT BENEFITS IN ACTION:
// ============================================================================
//
// ✅ AUTOCOMPLETE:
// When you type: gif.
// IDE suggests: id, title, url, width, height
//
// ✅ TYPE CHECKING:
// const gif: Gif = { id: '123' }; // ❌ Error! Missing properties
// const gif: Gif = { id: 123, ... }; // ❌ Error! id should be string
//
// ✅ REFACTORING:
// Rename 'title' to 'caption' in interface
// TypeScript finds all usages instantly
//
// ✅ DOCUMENTATION:
// Hover over Gif in IDE → See all properties and types
//
// ============================================================================
// COMPARISON WITH JAVASCRIPT (NO TYPESCRIPT):
// ============================================================================
//
// WITHOUT TYPESCRIPT (JavaScript):
// const gif = {
//   id: '123',
//   title: 'Cat',
//   // Forgot url, width, height - no error!
// };
// console.log(gif.url); // undefined - runtime error!
// console.log(gif.titel); // undefined - typo not caught!
//
// WITH TYPESCRIPT (This interface):
// const gif: Gif = {
//   id: '123',
//   title: 'Cat',
// }; // ❌ Compile error! Missing properties
//
// console.log(gif.url); // ✅ Must exist
// console.log(gif.titel); // ❌ Compile error! Property doesn't exist
//
// ============================================================================
// INTERFACE vs TYPE ALIAS:
// ============================================================================
//
// THIS FILE (Interface):
// export interface Gif {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
// }
//
// ALTERNATIVE (Type):
// export type Gif = {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
// };
//
// FOR THIS USE CASE: Both work identically!
//
// WHEN INTERFACES ARE BETTER:
// - Can be extended: interface ExtendedGif extends Gif { ... }
// - Can be merged (declaration merging)
// - Better error messages
// - More familiar to OOP developers
//
// WHEN TYPES ARE BETTER:
// - Union types: type Status = 'loading' | 'success' | 'error'
// - Intersection types: type Combined = A & B
// - Tuples: type Pair = [string, number]
// - Mapped types: type Readonly<T> = { readonly [P in keyof T]: T[P] }
//
// ============================================================================
// EXTENDING THIS INTERFACE:
// ============================================================================
//
// If you need additional properties in some parts of your app:
//
// export interface ExtendedGif extends Gif {
//   rating: 'g' | 'pg' | 'pg-13' | 'r';
//   username: string;
//   views: number;
//   isFavorite: boolean;
// }
//
// ExtendedGif has all 5 original properties PLUS 4 new ones
//
// ============================================================================
// OPTIONAL PROPERTIES:
// ============================================================================
//
// If some properties might not exist, use '?':
//
// export interface Gif {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
//   rating?: string;        // Optional
//   description?: string;   // Optional
// }
//
// Usage:
// if (gif.rating) {
//   console.log(gif.rating); // TypeScript knows it might be undefined
// }
//
// ============================================================================
// READONLY PROPERTIES:
// ============================================================================
//
// To prevent accidental modifications:
//
// export interface Gif {
//   readonly id: string;        // Can't be changed after creation
//   readonly title: string;
//   readonly url: string;
//   readonly width: number;
//   readonly height: number;
// }
//
// gif.id = 'new-id'; // ❌ Error! Cannot assign to readonly property
//
// ============================================================================
// INDEX SIGNATURES:
// ============================================================================
//
// If you need dynamic properties:
//
// export interface Gif {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
//   [key: string]: any; // Allow any additional properties
// }
//
// Now: gif.anyProperty works (but loses type safety)
//
// ============================================================================
// GENERIC INTERFACES:
// ============================================================================
//
// Make interfaces flexible with generics:
//
// export interface ApiResponse<T> {
//   data: T;
//   status: number;
//   message: string;
// }
//
// type GifResponse = ApiResponse<Gif[]>;
// // data is Gif[]
//
// type UserResponse = ApiResponse<User>;
// // data is User
//
// ============================================================================
// REAL-WORLD EVOLUTION:
// ============================================================================
//
// As your app grows, this interface might evolve:
//
// VERSION 1 (Current - Simple):
// export interface Gif {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
// }
//
// VERSION 2 (Add features):
// export interface Gif {
//   id: string;
//   title: string;
//   url: string;
//   width: number;
//   height: number;
//   rating?: 'g' | 'pg' | 'pg-13' | 'r';
//   username?: string;
//   importDate?: Date;
// }
//
// VERSION 3 (Nested objects):
// export interface Gif {
//   id: string;
//   title: string;
//   images: {
//     original: { url: string; width: number; height: number; };
//     thumbnail: { url: string; width: number; height: number; };
//   };
//   user?: {
//     username: string;
//     avatar: string;
//   };
// }
//
// ============================================================================
// KEY TAKEAWAYS:
// ============================================================================
//
// 1. INTERFACES DEFINE CONTRACTS
//    - Exact shape of objects
//    - All properties must match
//    - Types must be correct
//
// 2. SIMPLICITY IS POWERFUL
//    - Only 5 properties needed
//    - Easy to understand
//    - Fast to work with
//
// 3. DECOUPLING FROM API
//    - Our format ≠ API format
//    - Transform in one place
//    - App is independent
//
// 4. TYPE SAFETY EVERYWHERE
//    - Compile-time checking
//    - Autocomplete support
//    - Refactoring confidence
//
// 5. SELF-DOCUMENTING
//    - Code tells you what data looks like
//    - No need to check API docs constantly
//    - Clear expectations
//
// ============================================================================
// EXERCISES TO TRY:
// ============================================================================
// 1. Add an optional 'rating' property of type string
// 2. Make all properties readonly
// 3. Create an ExtendedGif interface that adds 3 more properties
// 4. Change title to be optional (title?: string)
// 5. Add JSDoc comments to each property
// 6. Create a utility type: PartialGif = Partial<Gif>
// 7. Create a type for just the dimensions: type Dimensions = Pick<Gif, 'width' | 'height'>
// 8. Create a type without id: type GifWithoutId = Omit<Gif, 'id'>
// 9. Add an index signature to allow additional properties
// 10. Create a validation function: isValidGif(obj: any): obj is Gif
// ============================================================================