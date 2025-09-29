// Defining an interface `Person` which describes the structure of a person object.
// - `firstname`: required string property.
// - `lastname`: required string property.
// - `age`: required number property.
// - `address?`: optional property that references an `Address` object.
interface Person {
    firstname: string;
    lastname: string;
    age: number;
    address?: Address;  // Optional → may or may not exist
}

// Defining the `Address` interface to represent an address object.
// - `postalCode`: required string property.
// - `city`: required string property.
interface Address {
    postalCode: string;
    city: string;
};

// Creating a constant `ironman` of type `Person`.
// This object includes an `address` because the property is optional.
const ironman: Person = {
    firstname: 'Tony',
    lastname: 'Stark',
    age: 45,
    address: {
        postalCode: 'ABC123',
        city: 'New York',
    }
};

// Creating another object `spiderman` of type `Person`.
// Here, `address` is omitted (valid, because it's optional).
const spiderman: Person = {
    firstname: "",
    lastname: "",
    age: 0
};

console.log(ironman, spiderman);

// ------------------- Exploring cloning vs referencing -------------------

// If you uncomment the following lines one by one, you can see how cloning affects behavior:

// 1. Direct reference: both variables point to the SAME object in memory.
// const spiderman = ironman;

// 2. Shallow copy using spread operator: only the top-level properties are copied.
// Nested objects (like `address`) remain linked by reference.
// const spiderman = { ...ironman };

// 3. Deep copy using `structuredClone`: all levels are copied independently.
// This ensures `ironman.address` and `spiderman.address` are completely separate objects.
// const spiderman = structuredClone(ironman);

// ------------------- Mutating the `spiderman` object -------------------

// If you mutate the properties of `spiderman`, the effect depends on how it was created:

// spiderman.firstname = 'Peter';
// spiderman.lastname = 'Parker';
// spiderman.age = 21; 

// console.log(ironman, spiderman);

// ------------------- Expected Behavior -------------------
// - With direct reference (`=`): changes to `spiderman` also change `ironman`.
// - With spread operator (`{ ...ironman }`): top-level changes are independent, but nested objects like `address` are still shared.
// - With `structuredClone`: all changes are independent; `ironman` stays intact.

//------------------------------ Key Notes -----------------------------//

// Optional property (address?): means it may be present or absent in objects of type Person.

// Direct assignment (=): creates a reference, not a copy.

// Spread ({ ...obj }): shallow copy, only one level deep.

// structuredClone(obj): deep copy, safe for nested structures like address.