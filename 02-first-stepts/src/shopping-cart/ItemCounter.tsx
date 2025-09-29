// Importing useState hook from React.
// This hook lets the component keep track of its own internal state.
import { useState } from "react";

// Importing CSS Module styles.
// CSS Modules scope styles locally, so "styles.itemRow" is unique to this component.
import styles from './ItemCounter.module.css';

// Defining the props interface with TypeScript.
// - name: required string (product name).
// - quantity: optional number (default is 1 if not provided).
interface Props {
    name: string;
    quantity?: number;
}

// Functional component definition.
// Uses destructuring to pull "name" and "quantity" from props.
// "quantity = 1" sets a default value if the parent doesn't provide it.
export const ItemCounter = ({ name, quantity = 1 }: Props) => {
    // Local state: count is initialized with "quantity".
    // setCount is used to update the state.
    const [count, setCount] = useState(quantity);

    // Event handler for adding items.
    const handleAdd = () => {
        setCount(count + 1);
    }

    // Event handler for subtracting items.
    // Prevents going below 1 by using a guard clause.
    const handleSubstract = () => {
        if (count === 1) return;
        setCount(count - 1);
    }

    return (
        <section
            // Apply CSS module class for row layout.
            className={styles.itemRow}
        >
            {/* Product name span */}
            <span
                // Using inline style for dynamic color:
                // If count === 1 → red, otherwise black.
                style={{
                    color: count === 1 ? 'red' : 'black',
                }}
            >
                {name}
            </span>

            {/* Button to increase count */}
            <button onClick={handleAdd}>+1</button>

            {/* Display current count */}
            <span>{count}</span>

            {/* Button to decrease count */}
            <button onClick={handleSubstract}>-1</button>
        </section>
    )
}
