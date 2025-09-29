import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { FirstStepsApp } from "./FirstStepsApp";
import { ItemCounter } from "./shopping-cart/ItemCounter";

// vi.mock('./shopping-cart/ItemCounter', () => ({
//     ItemCounter: (props: unknown) => (
//         <div
//             data-testid="ItemCounter"
//             name={props.name}
//             quantity={props.quantity}
//         />
//     ),
// }));

const mockItemCounter = vi.fn((_props: unknown) => {
    // console.log('vi.mock llamado')
    return <div data-testid="ItemCounter" />;
});

vi.mock('./shopping-cart/ItemCounter', () => ({
    ItemCounter: (props: unknown) => mockItemCounter(props),
}));


describe('FirstStepsApp', () => {

    afterEach(() => {
        vi.clearAllMocks()
    });

    test('should match snapshot', () => {
        const { container } = render(<FirstStepsApp />)
        expect(container).toMatchSnapshot()
    });

    test('should render the correct number of itemCounter components', () => {
        render(<FirstStepsApp />);
        // screen.debug();
        // console.log(screen.debug.length)
        // expect(screen.debug.length).toBe(3);
        const itemCounters = screen.getAllByTestId('ItemCounter');
        // console.log(itemCounters.length);
        expect(itemCounters.length).toBe(3)
    });

    test('should render ItemCounter with correct props', () => {
        render(<FirstStepsApp />);
        // screen.debug()
        expect(mockItemCounter).toHaveBeenCalledTimes(3);
        expect(mockItemCounter).toHaveBeenCalledWith({
            name: 'Nintendo Switch 2',
            quantity: 1,
        });
        expect(mockItemCounter).toHaveBeenCalledWith({
            name: 'Pro Controller',
            quantity: 2,
        });
        expect(mockItemCounter).toHaveBeenCalledWith({
            name: 'Super smash',
            quantity: 3,
        });

    })
})