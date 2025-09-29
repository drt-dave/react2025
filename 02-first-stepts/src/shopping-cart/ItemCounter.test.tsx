import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ItemCounter } from "./ItemCounter";

describe("ItemCounter", () => {
    test("should render with default values", () => {
        const name = "test item";
        render(<ItemCounter name="test item" />);
        // screen.debug();
        expect(screen.getByText(name)).toBeDefined();
        expect(screen.getByText(name)).not.toBeNull();
    });
    test("should render with provided quantity", () => {
        const name = "Control de Nintendo";
        const quantity = 3;
        render(<ItemCounter name={name} quantity={quantity} />)
        expect(screen.getByText(quantity)).toBeDefined();
    });
    test("should increase the count when +1 button is clicked", async () => {
        const name = "test item";
        const quantity = 3;
        render(<ItemCounter name={name} quantity={quantity} />)
        const [buttonAdd] = screen.getAllByRole('button');

        fireEvent.click(buttonAdd);

        expect(screen.getByText(quantity + 1)).toBeDefined();
    });
    test('should decrease count when -1 button is clicked', () => {
        const name = "test item";
        const quantity = 5;
        render(<ItemCounter name={name} quantity={quantity} />)
        const [, buttonSubstract] = screen.getAllByRole('button');
        fireEvent.click(buttonSubstract);
        expect(screen.getByText(quantity - 1)).toBeDefined();
    });
    test('should not decrease count when -1 button is clicked and quantity is 1', () => {
        const name = "test item";
        const quantity = 1;
        render(<ItemCounter name={name} quantity={quantity} />)
        const [, buttonSubstract] = screen.getAllByRole('button');
        fireEvent.click(buttonSubstract);
        expect(screen.getByText(quantity)).toBeDefined()
    });
    test('should change to red when count is 1', () => {
        const quantity = 1;
        const name = 'Test item';
        render(<ItemCounter name={name} quantity={quantity} />);

        const itemText = screen.getByText(name);
        // console.log(itemText.style.color);
        expect(itemText.style.color).toBe('red');

    })

});