# MyCounterApp Component - Explicación Completa

## Descripción General
Componente simple que demuestra el uso de un custom hook para gestionar el estado de un contador.

## Conceptos de Aprendizaje
- Uso de Custom Hooks
- Event Handlers
- Inline Styles en React
- Component Composition

## El Código

```typescript
import { useCounter } from './hooks/useCounter'

export const MyCounterApp = () => {
    const { counter, handleAdd, handleReset, handleSubstract } = useCounter();

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1>counter: {counter}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleAdd}>+1</button>
                    <button onClick={handleSubstract}>-1</button>
                    <button onClick={handleReset}>Reset</button>
                </div>
            </div>
        </>
    )
}
```

## Desglose del Código

### Custom Hook Usage
```typescript
const { counter, handleAdd, handleReset, handleSubstract } = useCounter();
```

El hook `useCounter` encapsula toda la lógica del contador:
- `counter`: Valor actual
- `handleAdd`: Incrementa en 1
- `handleSubstract`: Decrementa en 1
- `handleReset`: Vuelve al valor inicial

### Event Handlers
```typescript
<button onClick={handleAdd}>+1</button>
```

Los event handlers se pasan directamente sin arrow function porque no necesitan parámetros.

### Inline Styles
```typescript
style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}}
```

Estilos inline en React usan objetos JavaScript:
- Primera `{}`: Expresión JSX
- Segunda `{}`: Objeto JavaScript
- Propiedades en camelCase: `flexDirection` en lugar de `flex-direction`

## Conceptos Clave

1. **Separación de Lógica**: La lógica del contador está en el hook, no en el componente
2. **Componente Presentacional**: Este componente solo renderiza UI
3. **Reusabilidad**: El hook podría usarse en otros componentes
