// Declaring a constant variable `firstName` with the value 'David'.
// Using `const` means this variable cannot be reassigned.
const firstName = 'David';

// Declaring a constant variable `lastName` with the value "Mc'Donnough".
// Notice that single quotes (') can safely be used inside a string 
// if the string is declared with double quotes (") and vice versa.
const lastName = "Mc'Donnough";

// Using a template literal (backticks ``) to interpolate variables directly into a string.
// `${firstName} ${lastName}` dynamically creates the full name by inserting
// the values of `firstName` and `lastName` separated by a space.
const fullName = `${firstName} ${lastName}`;

// Logging the result to the console.
// Wrapping `fullName` inside `{ }` prints an object with a key and value, 
// making the output more descriptive in the console.
console.log({ fullName });

// Example output:
// { fullName: "David Mc'Donnough" }
