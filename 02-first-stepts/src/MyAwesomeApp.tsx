// Importing the CSSProperties type from React.
// This type allows us to strongly type inline styles in React with TypeScript.
import type { CSSProperties } from "react";

// Basic string variables
const firstName = 'Davo';
const lastName = 'Doroto';

// An array of strings. We'll later join them into a single string for display.
const favoriteGames = ['Elden Ring', 'Smash', 'Metal Gear'];

// A boolean variable to demonstrate conditional rendering.
const isActive = false;

// An object with two properties. We'll stringify it to display on screen.
const address = {
    zipCode: 'ABC-123',
    country: 'Canada',
}

// Inline styles object, typed as CSSProperties.
// This ensures the keys (e.g. backgroundColor) are valid CSS properties.
const myStyles: CSSProperties = {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 10,
    marginTop: 30,
}

// Main functional component.
// Exported so it can be imported and used in other files.
export const MyAwesomeApp = () => {

    // JSX returned by the component
    return (
        <div data-testid="div-app">
            {/* Displaying simple string variables */}
            <h1 data-testid="first-name-tittle">{firstName}</h1>
            <h2>{lastName}</h2>

            {/* Displaying array values joined into a single string */}
            <p>{favoriteGames.join(', ')} </p>

            {/* Displaying the result of an inline expression (2 + 2 = 4) */}
            <p>{2 + 2}</p>

            {/* Conditional rendering: show different text depending on the value of isActive */}
            <h1>{isActive ? 'Activo' : 'No activo'} </h1>

            {/* Applying inline styles and displaying an object as a JSON string */}
            <p style={myStyles}>{JSON.stringify(address)}</p>
        </div>
    );
}
