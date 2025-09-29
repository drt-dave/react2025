// Example 1 (commented out):
// An array that can contain both numbers and strings.
// TypeScript syntax: (number | string)[]
// This means each element can be either a number OR a string.
// const myArray: (number | string)[] = [1, 2, 3, '4', 5];

// Example 2 (active code):
// An array that can only contain numbers.
// TypeScript infers the type `number[]` from the initial values.
const myArray: number[] = [1, 2, 3, 4, 5];

// Using the spread operator (`...`) to create a shallow copy of `myArray`.
// `myArray2` is a new array instance with the same elements as `myArray` at this moment.
const myArray2 = [...myArray];

// Adding a new element (6) to `myArray` using `.push()`.
// This modifies only `myArray`, not `myArray2`, because the spread operator created a new copy.
myArray.push(6);

// Logging both arrays to the console.
// - `myArray` will include the new element [1, 2, 3, 4, 5, 6].
// - `myArray2` will remain [1, 2, 3, 4, 5].
console.log(myArray, myArray2);

// Example Output:
// [1, 2, 3, 4, 5, 6] [1, 2, 3, 4, 5]
