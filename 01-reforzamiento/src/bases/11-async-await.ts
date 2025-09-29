// Importing TypeScript types to provide strong typing for API responses.
// - `GiphyRandonResponse`: the full response structure returned by Giphy's Random GIF API.
// - `Gif`: a type alias for a single GIF object (not directly used here, but useful for type safety).
import type { GiphyRandonResponse, Gif } from "../data/giphy.response";

// Your personal API key for authenticating requests to the Giphy API.
// ⚠️ Security Note: Avoid hardcoding API keys in source files.
// In production, use environment variables or a secure secrets manager.
const API_KEY = 'yHu4WxykuBYvOZ77bJfgGLXT20qzlHQp';

// Utility function: dynamically creates an <img> element in the DOM and sets its source.
// - Input: `url` (string) → the direct URL of the GIF image.
// - Output: an <img> element appended to the page's <body>.
const createImageInsideDOM = (url: string) => {
    const imgElement = document.createElement('img');
    imgElement.src = url;
    document.body.append(imgElement);
};

// Asynchronous function that fetches a random GIF URL from the Giphy API.
// - Declared as `async`, so it automatically returns a `Promise`.
// - Return type is `Promise<string>` (the URL of the GIF).
const getRandonGifUrl = async (): Promise<string> => {
    // Step 1: Send a request to Giphy's Random GIF endpoint with your API key.
    const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}`
    );

    // Step 2: Parse the JSON response into a JavaScript object.
    // Using TypeScript type annotation `: GiphyRandonResponse` for strong typing.
    const { data } : GiphyRandonResponse = await response.json();


    // Step 3: Extract and return the original GIF image URL.
    return data.images.original.url;
};

// Call the async function, then pass the result (GIF URL) into `createImageInsideDOM`.
// This ensures that once the Promise resolves, the GIF will be displayed in the DOM.
getRandonGifUrl().then(createImageInsideDOM);

//------------------------ Key Definitions-----------------------------------//

// async/await: A modern way to handle asynchronous code in JavaScript/TypeScript.

// await pauses execution until the Promise resolves.

// Makes the code easier to read compared to .then() chaining.

// Promise<T>: Represents a future value. Here, Promise<string> means the function will eventually return a string (the GIF URL).

// DOM Manipulation: With document.createElement and .append, you dynamically alter the HTML page to display new content.

// TypeScript Typing: The use of : GiphyRandonResponse enforces the expected structure of the API response, preventing runtime errors.