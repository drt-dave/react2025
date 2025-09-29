// Importing the ItemCounter component from the shopping-cart folder.
// This child component will be used to display each product in the cart.
import { ItemCounter } from "./shopping-cart/ItemCounter";

// Defining a TypeScript interface to describe the structure of items in the cart.
// Every item must have a "productName" (string) and a "quantity" (number).
interface ItemInCart {
    productName: string;
    quantity: number;
}

// Array of items currently in the shopping cart.
// Each object follows the ItemInCart interface definition.
const itemsInCart: ItemInCart[] = [
    { productName: 'Nintendo Switch 2', quantity: 1 },
    { productName: 'Pro Controller', quantity: 2 },
    { productName: 'Super smash', quantity: 3 },
];

// Main functional component exported from this file.
// It will render the title and the list of items using the ItemCounter component.
export function FirstStepsApp() {
    return (
        <>
            {/* Application title */}
            <h1>Carrito de compras</h1>

            {/* Render the list of items dynamically using Array.map */}
            {itemsInCart.map(({ productName, quantity }) => (
                // For each item, render one ItemCounter component.
                // - "key" is required by React for list rendering performance.
                // - Passing props: "name" and "quantity" to the ItemCounter component.
                <ItemCounter
                    key={productName}
                    name={productName}
                    quantity={quantity}
                />
            ))}

            {/* The code below shows a manual version without map().
                It was replaced by the dynamic version above. 
                Keeping it commented helps understand the difference. */}
            {/*
            <ItemCounter name="Nintendo Switch 2" quantity={1} />
            <ItemCounter name="Pro Controller" quantity={2} />
            <ItemCounter name="Super smash" quantity={3} />
            */}
        </>
    );
}
