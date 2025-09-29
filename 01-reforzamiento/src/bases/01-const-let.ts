// Declaring a constant variable `firstName` with an explicit type annotation `string`.
// This means TypeScript enforces that the value must always be of type `string`.
// `const` is used, so the variable cannot be reassigned to another value.
const firstName: string = 'David';

// Declaring a mutable variable `lastName` with `let`.
// Here, no explicit type annotation is provided, but TypeScript infers it as `string` from the initial value.
let lastName = 'Duarte';

// Declaring a mutable variable `diceNumber` and initializing it with the number 5.
// TypeScript infers the type as `number`.
let diceNumber = 5;

// Reassigning a new number to `diceNumber` is allowed because it was declared with `let`.
diceNumber = 3;

// Using the string method `.includes()` to check if `firstName` contains the lowercase letter "a".
// This returns a boolean (`true` or `false`).
const containsLetterA = firstName.includes('a');

// Logging multiple values to the console.
// By wrapping them in `{ }`, an object literal is created, 
// so the console output will show the property names along with their values.
console.log({ containsLetterA, diceNumber, firstName, lastName });

// Example output in the console might look like:
// { containsLetterA: false, diceNumber: 3, firstName: "David", lastName: "Duarte" }
