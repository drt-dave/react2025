// Importing TypeScript types to provide strong typing for API responses.
// `GiphyRandonResponse` represents the expected structure of the response object returned by Giphy's Random GIF API.
// `Gif` is likely a type alias for an individual GIF object.
import type { GiphyRandonResponse, Gif } from "../data/giphy.response";

// Your personal Giphy API key, required to authenticate requests to the Giphy API.
// ⚠️ Important: In real-world projects, API keys should not be hardcoded in source files. 
// Instead, store them in environment variables for security.
const API_KEY = 'yHu4WxykuBYvOZ77bJfgGLXT20qzlHQp';

// Create a `fetch` request to the Giphy Random GIF endpoint.
// This request retrieves one random GIF using the provided API key.
const myRequest = fetch(
`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}`
);

// Utility function that creates an <img> element and inserts it into the DOM.
// - `url: string` is the direct URL of the GIF image.
// - `document.createElement('img')` dynamically generates an HTML <img> element.
// - `.src` sets the image source to the provided URL.
// - `document.body.append(imgElement)` attaches the image at the end of the <body>.
const  createImageInsideDOM = (url:string) => {
const imgElement = document.createElement('img');
    imgElement.src = url;
    document.body.append(imgElement);
}

myRequest
//------------Primero estaba así------------------//
// .then(( response) => {
    // response.json().then( ( data) => {
        // console.log( data);
    // })
// })
// ---------------Luego estaba así----------------//
// .then( ( response) => response.json())
// .then( ( data) => {
//     const imageUrl = data.data.images.original.url;
//     console.log(imageUrl)
//     const imgElement = document.createElement('img');
//     imgElement.src = imageUrl;
//     document.body.append(imgElement);
// })
// .catch((err)=>{
//     console.error(err);
// });
//------------------------- Finalmente así-------------------//
// se agrega type GiphyRandonResponse y se desestructura { data } para evitar data.data
// Se crea la función createImageInsideDOM y se llama con el imageUrl
.then( ( response) => response.json())
.then( ( { data }: GiphyRandonResponse ) => {
    const imageUrl = data.images.original.url
    createImageInsideDOM(imageUrl);
})
.catch((err)=>{
    console.error(err);
});

//  ---------------Key Definitions for Understanding ---------------------------//

// Fetch API: A modern interface in JavaScript for making HTTP requests. It returns a Promise that resolves to the response object.

// Promise: An object representing the eventual completion or failure of an asynchronous operation. You can attach .then() for success and .catch() for errors.

// JSON (JavaScript Object Notation): A text format for representing structured data. APIs commonly return JSON that you parse into JavaScript objects.

// Destructuring: A JavaScript/TypeScript feature that allows extracting properties from objects. Example:

// const { data } = response;


// instead of const data = response.data;

// DOM (Document Object Model): The structured representation of an HTML page. document.createElement and document.body.append allow dynamic manipulation of the page’s content.

// TypeScript Types: Adding types (e.g., GiphyRandonResponse) helps catch mistakes during development by ensuring that the API response matches the expected structure.