export const add = (a: number, b: number): number => {
    return a + b;
};

export const substract = (a: number, b: number): number => {
    return a - b;
};

export const multiply = (a: number, b: number): number => {
    return a * b;
};

export const divide = (a: number, b: number): number => {
    if (b === 0) throw new Error('No se puede dividir por cero');
    return a / b;
};