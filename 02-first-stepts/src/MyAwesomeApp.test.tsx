import { describe, expect, test } from "vitest"
import { render, screen } from "@testing-library/react"

import { MyAwesomeApp } from "./MyAwesomeApp"

describe('MyAwesomeApp', () => {
    test('should render firstName and lastName', () => {
        const { container } = render(<MyAwesomeApp />)
        screen.debug();

        const h1 = container.querySelector('h1');
        const h2 = container.querySelector('h2');

        expect(h1?.innerHTML).toBe('Davo');
        expect(h2?.innerHTML).toContain('oto');
    });
    test('should render firstName and lastName - screen', () => {
        render(<MyAwesomeApp />)
        screen.debug();
        // const h1 = screen.getByRole('heading', { level: 1 });
        const h1 = screen.getByTestId('first-name-tittle');


        expect(h1?.innerHTML).toContain('avo');
    });
    test('should match snapshot', () => {
        const { container } = render(<MyAwesomeApp />)
        expect(container).toMatchSnapshot();
    });

    test('should match snapshot', () => {
        render(<MyAwesomeApp />);
        expect(screen.getByTestId('div-app')).toMatchSnapshot();
    })
})

