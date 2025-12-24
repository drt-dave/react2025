# useCounter Hook - Explicación Completa

## Descripción General
Custom hook simple que gestiona el estado de un contador con funciones para incrementar, decrementar y resetear.

## El Código

```typescript
import { useState } from "react";

export const useCounter = (initialValue: number = 10) => {
    const [counter, setCounter] = useState(initialValue);

    const handleAdd = () => {
        setCounter(counter + 1);
    }

    const handleSubstract = () => {
        setCounter((prevState) => prevState - 1);
    }

    const handleReset = () => {
        setCounter(initialValue);
    }

    return {
        // Values
        counter,

        // Methods / Actions
        handleAdd,
        handleSubstract,
        handleReset
    }
}
```

## Parámetros

### initialValue (opcional)
```typescript
initialValue: number = 10
```
- Valor inicial del contador
- Default: 10
- Permite crear contadores con diferentes valores iniciales

## Estado

```typescript
const [counter, setCounter] = useState(initialValue);
```
- Almacena el valor actual del contador
- Inicializa con `initialValue`

## Funciones

### handleAdd
```typescript
const handleAdd = () => {
    setCounter(counter + 1);
}
```
- Incrementa el contador en 1
- Usa el valor actual directamente

### handleSubstract
```typescript
const handleSubstract = () => {
    setCounter((prevState) => prevState - 1);
}
```
- Decrementa el contador en 1
- Usa la función de actualización con `prevState`
- **Forma recomendada**: Garantiza usar el valor más reciente

### handleReset
```typescript
const handleReset = () => {
    setCounter(initialValue);
}
```
- Resetea al valor inicial
- Mantiene referencia al `initialValue` original

## Return Object

```typescript
return {
    counter,
    handleAdd,
    handleSubstract,
    handleReset
}
```

Devuelve:
- **Valores**: `counter` - El estado actual
- **Métodos**: Funciones para manipular el estado

## Dos Formas de Actualizar Estado

### 1. Valor Directo
```typescript
setCounter(counter + 1)
```
- Usa el valor actual del estado
- OK para actualizaciones simples

### 2. Función de Actualización (Recomendada)
```typescript
setCounter((prevState) => prevState - 1)
```
- Recibe el estado previo como parámetro
- **Más seguro**: Garantiza usar el valor más reciente
- **Recomendado para**: Actualizaciones basadas en estado anterior

## ¿Cuándo usar cada forma?

**Usar valor directo:**
- Cuando NO dependes del valor anterior
- Ejemplo: `setCounter(0)` - resetear a cero

**Usar función de actualización:**
- Cuando dependes del valor anterior
- Ejemplo: `setCounter(prev => prev + 1)` - incrementar
- Previene bugs con actualizaciones múltiples

## Uso en Componente

```typescript
const { counter, handleAdd, handleReset, handleSubstract } = useCounter(20);

// counter: 20 (valor inicial)
// handleAdd() -> counter: 21
// handleSubstract() -> counter: 20
// handleReset() -> counter: 20 (vuelve al inicial)
```

## Resumen

Este hook es un ejemplo perfecto de:
- Encapsulación de lógica de estado
- Reutilización de código
- Patrón de custom hook simple pero efectivo
