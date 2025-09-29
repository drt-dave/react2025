// Importing data and types from an external file "../data/heroes.data".
// - `heroes`: an array of hero objects.
// - `Owner`: likely an enum (e.g., Marvel, DC).
// - `Hero`: a TypeScript type or interface describing the shape of a hero.
import { heroes, Owner, type Hero } from "../data/heroes.data";


// ------------------- Function: getHeroById -------------------

// Function that retrieves a hero by its `id`.
// - Input: `id` (number)
// - Output: Either a `Hero` object if found, or `undefined` if no match.
const getHeroById = (id: number): Hero | undefined => {
  // `.find()` iterates through the `heroes` array and returns the first match.
  const hero = heroes.find((hero) => {
    return hero.id === id;
  });

  // Optional error handling (commented out):
  // You could throw an error if no hero is found:
  // if (!hero) {
  //   throw new Error(`No hero exists with id ${id}`);
  // }

  return hero;
};

// Example usage:
// console.log(getHeroById(5));


// ------------------- Function: getHeroesByOwner -------------------

// Function that retrieves all heroes belonging to a given owner.
// - Input: `owner` of type `Owner` (enum).
// - Output: An array of `Hero[]` objects.
export const getHeroesByOwner = (owner: Owner): Hero[] => {
  // `.filter()` creates a new array containing only heroes
  // whose `owner` property matches the given `owner`.
  const heroesByOwner = heroes.filter((hero) => hero.owner === owner);

  return heroesByOwner;
};

// Example usage: get all heroes from Marvel
console.log(getHeroesByOwner(Owner.Marvel));

//-------------------------------------------- Key Definitions:

// .find(): Returns the first element in the array that satisfies the condition. If no match, it returns undefined.

// .filter(): Returns a new array with all elements that satisfy the condition. If no matches, returns an empty array [].

// Union type (Hero | undefined): Indicates that the return value may be either a Hero or undefined.

// Enum (Owner): A special TypeScript construct used to define a set of named constants (e.g., Owner.Marvel, Owner.DC).