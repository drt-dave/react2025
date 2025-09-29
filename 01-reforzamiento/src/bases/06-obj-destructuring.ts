// ------------------- Object and Destructuring -------------------

// Defining a plain JavaScript object `person` with 4 properties.
// Note: It has an "extra" property `rank` which may or may not be required in an interface.
const person = {
  name: 'Tony',
  age: 45,
  key: 'Ironman',
  rank: 'Capitan', // Extra property
};

// Object destructuring: extract specific properties from `person` into new constants.
// Equivalent to manually writing:
// const name = person.name;
// const age = person.age;
// const key = person.key;
const { name, age, key } = person;

console.log({ name, age, key });
// Output: { name: 'Tony', age: 45, key: 'Ironman' }


// ------------------- Interface Definition -------------------

// Interface `Hero` defines the expected structure of a hero object.
// - `name`: required string
// - `age`: required number
// - `key`: required string
// - `rank`: optional string (may or may not exist)
interface Hero {
  name: string;
  age: number;
  key: string;
  rank?: string; // Optional property
}


// ------------------- Function using Destructuring -------------------

// Function `useContext` takes an object that matches the `Hero` interface.
// Parameters are destructured directly in the function signature.
const useContext = ({ key, name, age, rank }: Hero) => {
  return {
    keyName: key, // Renaming `key` to `keyName`
    user: {
      name, // Shorthand for `name: name`
      age,  // Shorthand for `age: age`
    },
    rank: rank, // Keeping rank (if provided), otherwise `undefined`
  };
};


// ------------------- Using the function -------------------

// Passing the `person` object into `useContext`.
// Thanks to structural typing in TypeScript, `person` matches `Hero` 
// (the extra `rank` property is fine, because it's defined as optional).
const { rank, keyName, user } = useContext(person);

// Logging the destructured results.
console.log(rank, keyName, user.name);
// Output: Capitan Ironman Tony

//------------------------------------ Key Definitions:

// Object destructuring: A shorthand to extract properties into variables.

// Interface: A TypeScript feature that enforces object structure (required vs optional properties).

// Optional property (rank?): Can be omitted when creating objects of type Hero.

// Function parameter destructuring: Lets you pull out properties directly in the parameter list.

// Structural typing in TS: If an object has at least the required properties of an interface, it matches the type—even if it has extras.