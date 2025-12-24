import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useCounter } from "./useCounter";

describe('useCounter', () => {
    test('should initialize with default value', () => {
        const defaultValue = 10
        const { result } = renderHook(() => useCounter());
        expect(result.current.counter).toBe(defaultValue);
    });
    test('should initialize with default value', () => {
        const initialValue = 20;
        const { result } = renderHook(() => useCounter(initialValue));
        expect(result.current.counter).toBe(initialValue);
    });

    test('should increment counter when handleAdd is called', () => {
        const initialValue = 10;
        const { result } = renderHook(() => useCounter());
        act(() => {
            result.current.handleAdd();
        });
        expect(result.current.counter).toBe(initialValue + 1)
    });
    test('should decrement counter when handleAdd is called', () => {
        const initialValue = 10;
        const { result } = renderHook(() => useCounter());
        act(() => {
            result.current.handleSubstract();
        });
        expect(result.current.counter).toBe(initialValue - 1)
    });
    test('should reset counter when handleReset is called', () => {
        const initialValue = 10;
        const { result } = renderHook(() => useCounter());
        act(() => {
            result.current.handleAdd();
        });
        act(() => {
            result.current.handleReset();
        });
        expect(result.current.counter).toBe(initialValue)
    });
});

