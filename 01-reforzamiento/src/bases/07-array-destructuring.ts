// ------------------- Array Destructuring -------------------

// Defining an array of character names.
const characterNames = ['Goku', 'Vegeta', 'Trunks'];

// Using array destructuring to skip the first two elements
// and extract the third one (`Trunks`) directly into a variable.
const [, , trunks] = characterNames;

console.log({ trunks });
// Output: { trunks: 'Trunks' }


// ------------------- Function Returning a Tuple -------------------

// Function returning a tuple of [string, number].
// - TypeScript infers the return as a tuple thanks to `as const`,
//   meaning the values have fixed positions and types.
const retursnArrayFn = (): [string, number] => {
  return ['ABC', 123] as const;
};

// Destructuring the tuple into two variables: `letters` and `numbers`.
const [letters, numbers] = retursnArrayFn();

console.log({ letters, numbers });
// Output: { letters: 'ABC', numbers: 123 }


// ------------------- Task: Simulating useState -------------------

// Requirements:
// - Function called `useState`
// - Returns an array with two elements:
//   #1: A string (the initial value)
//   #2: A function that takes a string and logs it to the console

// Implementation:
// - Input: `name: string` (initial value)
// - Output: A tuple [string, function] marked as `as const`
//   so TypeScript knows it's a fixed-length tuple with read-only positions.
const useState = (name: string) =>
  [name, (newName: string) => console.log(newName)] as const;


// ------------------- Using the custom useState -------------------

// Destructuring the result of `useState`:
// - `name`: holds the initial string ("Gokú")
// - `setName`: a function that accepts a new string and logs it
const [name, setName] = useState('Gokú');

// Logging the initial state
console.log(name); 
// Output: Gokú

// Updating (simulating React's setState behavior)
// Calls the function returned in the tuple and logs the new name.
setName('Vegeta');
// Output: Vegeta

// -----------------------------------Key Definitions:

// Array destructuring: Pulling out elements from an array into variables by position.

// Tuple ([string, number]): A fixed-length array with defined types for each position.

// as const: Tells TypeScript to treat the return value as a literal tuple, not just a general array.

// Custom useState: Mimics React’s hook pattern—returns a state value and a setter function.