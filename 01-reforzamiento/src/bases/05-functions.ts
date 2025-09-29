
// ------------------- Functions -------------------

// Regular named function with explicit return type `string`.
// Takes a parameter `name` of type string and returns a greeting string.
function greet(name: string): string {
  return `Hola, ${name}`;
}  

// const greet2 = (name: string): string => {
//   return `Hola, ${name}`;
// }

// Arrow function (concise version). "One line"
// TypeScript infers the return type as `string` automatically.
const greet2 = ( name: string ) => `Hola, ${name}`;

// Calling both functions and storing their results in constants.
const message = greet('Gokú');
const message2 = greet2('Vegeta');

// Logs both messages: "Hola, Gokú Hola, Vegeta"
console.log(message, message2);

// ------------------- Interfaces and Object Factories -------------------

// Interface `User` defines the expected structure of a user object.
// - `uid`: string (unique identifier).
// - `username`: string (username).
interface User {
    uid: string;
    username: string;
}

// Regular function returning an object that conforms to the `User` interface.
function getUser(): User {
    return {
        uid: 'ABC123',
        username: 'El_Papi1502'
    }
}

// Arrow function returning an object literal.
// The parentheses `()` around the object are necessary to distinguish it from a function body.
const getUser2 = () => ({ 
        uid:'ABC567',
        username: 'El_Papi567'
})

// Calling both functions to create `User` objects.
const user = getUser();
const user2 = getUser2();
console.log(user,user2); // Logs both user objects.

// ------------------- Arrays and Iteration -------------------

// Declaring an array of numbers.
const myNumbers: number[] = [1,2,3,4,5];

// Iterating with an arrow function:
// myNumbers.forEach( function ( value){
//     console.log({ value });
// })

// Attempt to pass `console.log` directly:
// myNumbers.forEach((value)=>{ console.log({ value }) });

// ⚠️ Problem: `forEach` passes 3 arguments to its callback → (value, index, array).
// `console.log` will print all three, not just the value.
// So instead of logging `{ value: 1 }`, it might log something unexpected like: 1 0 [1,2,3,4,5].
myNumbers.forEach( console.log );

// ---------------------------Key Definitions:

// Function vs Arrow Function

// Named function (function greet() {}): clearer stack traces, hoisted.

// Arrow function (const greet2 = () => {}): concise, does not bind its own this.

// Interface: Defines the shape of an object (contract enforced by TypeScript).

// forEach: Calls the callback for each array element with (value, index, array).

// console.log in forEach: Passing it directly can lead to unexpected extra arguments being logged.