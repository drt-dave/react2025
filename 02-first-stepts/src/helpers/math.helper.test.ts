import { describe, expect, test } from 'vitest'
import { add, divide, multiply, substract } from './math.helper';

describe('Add', () => {
    test('should add two numbers', () => {
        // Test implementation will go here
        const result = add(2, 7);
        console.log('result:', result);

        expect(result).toBe(9);
    });
});

describe('Substract', () => {
    test('should substract two numbers a<b, and the result be negative', () => {
        const a = 2;
        const b = 7;
        const result = substract(a, b);
        console.log('result:', result);

        expect(result).toBeLessThan(0);
    });

    test('should substract two numbers', () => {
        const a = 5;
        const b = 3;
        const result = substract(a, b);
        console.log('result:', result);

        expect(result).toBe(2);
    });

});

describe('Multiply', () => {
    test('should multiply two numbers', () => {
        const a = 2;
        const b = 7;
        const result = multiply(a, b);
        console.log('result:', result);

        expect(result).toBe(14);
    });

    test('shoul multiply by zero', () => {
        const a = 2;
        const result = multiply(a, 0);
        console.log('result:', result);

        expect(result).toBe(0);
    });
});

describe('Divide', () => {
    test('should divide two numbers', () => {
        const a = 0;
        const b = 4;
        const result = divide(a, b);

        expect(result).toBe(a / b);
    });

});