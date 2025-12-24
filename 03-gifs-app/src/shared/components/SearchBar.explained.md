# SearchBar Component - Explicación Completa

## Descripción General
Este componente implementa una barra de búsqueda con varios conceptos avanzados de React:
- Controlled inputs (React maneja el valor del input)
- Debouncing (retrasar llamadas a API hasta que el usuario pare de escribir)
- Event handlers (eventos de teclado y mouse)
- Side effects con useEffect
- Funciones de cleanup para prevenir memory leaks

## Conceptos de Aprendizaje
- **useState**: Gestionar estado del componente
- **useEffect**: Realizar side effects (auto-search después de escribir)
- **Controlled Components**: React es dueño del valor del input
- **Debouncing**: Técnica de optimización de rendimiento
- **Event Typing**: Tipos de eventos TypeScript
- **Callback Props**: Comunicar de hijo a padre

## El Código Completo

```typescript
import { useEffect, useState, type KeyboardEvent } from "react";

interface Props {
    placeholder: string;
    buttonTitle: string;
    onQuery: (query: string) => void;
}

export const SearchBar = ({
    placeholder = 'Buscar',
    buttonTitle,
    onQuery
}: Props) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onQuery(query)
        }, 700);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [query, onQuery])

    const handleSearch = () => {
        onQuery(query);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>
                {buttonTitle}
            </button>
        </div>
    )
}
```

## Props Interface

```typescript
interface Props {
    placeholder: string;
    buttonTitle: string;
    onQuery: (query: string) => void;
}
```

**onQuery** - Callback function:
```typescript
(query: string) => void
  ↑              ↑    ↑
  |              |    └─ No devuelve nada (void)
  |              └────── Toma parámetro string llamado 'query'
  └─────────────────── Arrow function syntax
```

Este es el patrón "lifting state up" - el componente padre decide qué hacer con la query de búsqueda.

## State Management - Controlled Input

```typescript
const [query, setQuery] = useState('');
```

**¿Qué es un Controlled Component?**
En un "controlled component", React es dueño del valor del input:
1. Usuario escribe → evento onChange se dispara
2. onChange llama setQuery con el nuevo valor
3. Componente se re-renderiza con el nuevo valor de query
4. Input muestra el valor desde el estado (query)

Esto crea una "única fuente de verdad" - el estado de React.

## Debouncing con useEffect

```typescript
useEffect(() => {
    const timeoutId = setTimeout(() => {
        onQuery(query)
    }, 700);

    return () => {
        clearTimeout(timeoutId);
    };
}, [query, onQuery])
```

### ¿Qué es Debouncing?

Debouncing retrasa la ejecución de una función hasta después de que un usuario ha dejado de realizar una acción. Esto previene llamadas excesivas a API mientras se escribe.

**Ejemplo SIN debouncing:**
```
Usuario escribe "cat" → 3 llamadas a API ('c', 'ca', 'cat') ❌ ¡Desperdicio!
```

**Ejemplo CON debouncing (700ms):**
```
Usuario escribe "cat" rápidamente → Espera 700ms → 1 llamada a API ('cat') ✅ ¡Eficiente!
```

### ¿Cómo funciona esto?

1. Usuario escribe un carácter
2. Estado `query` se actualiza
3. useEffect corre porque `query` cambió
4. setTimeout programa que onQuery corra en 700ms
5. Si el usuario escribe de nuevo antes de 700ms:
   - useEffect corre de nuevo
   - Cleanup function cancela el timeout anterior
   - Nuevo timeout es programado
6. Después de 700ms sin escribir, onQuery finalmente se ejecuta

### Cleanup Function

```typescript
return () => {
    clearTimeout(timeoutId);
};
```

**¿Por qué es necesario el cleanup?**

**SIN cleanup:**
Si el usuario escribe "hello":
- 'h' → timeout programado (700ms)
- 'e' → timeout programado (700ms) [¡primer timeout aún corriendo!]
- 'l' → timeout programado (700ms) [¡dos timeouts corriendo!]
- 'l' → timeout programado (700ms) [¡tres timeouts corriendo!]
- 'o' → timeout programado (700ms) [¡cuatro timeouts corriendo!]
Resultado: 5 llamadas a API para "hello" ❌

**CON cleanup:**
- 'h' → timeout programado
- 'e' → cancela timeout anterior, programa nuevo
- 'l' → cancela timeout anterior, programa nuevo
- 'l' → cancela timeout anterior, programa nuevo
- 'o' → cancela timeout anterior, programa nuevo
- Después de 700ms → 1 llamada a API para "hello" ✅

**Prevención de Memory Leak:**
Si el componente se desmonta mientras un timeout está pendiente, la función cleanup lo cancela, previniendo:
- Llamar funciones en componentes desmontados (error de React)
- Memory leaks de timers huérfanos

### Dependency Array

```typescript
}, [query, onQuery])
```

**¿Cuándo corre este effect?**
- En render inicial (componente se monta)
- Cuando 'query' cambia (usuario escribe)
- Cuando 'onQuery' cambia (raro, pero posible si padre lo re-crea)

**REGLA IMPORTANTE:**
Cada valor del scope del componente que se usa dentro del effect DEBE estar en el array de dependencias. ESLint te advertirá si lo olvidas.

## Event Handlers

### handleSearch
```typescript
const handleSearch = () => {
    onQuery(query);
};
```

Se llama cuando:
- Usuario hace clic en el botón de búsqueda
- Usuario presiona la tecla Enter (vía handleKeyDown)

### handleKeyDown
```typescript
const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
}
```

**TypeScript Event Typing:**
```typescript
KeyboardEvent<HTMLInputElement>
      ↑               ↑
      |               └─ El tipo de elemento (input)
      └───────────────── El tipo de evento (keyboard)
```

Esto da autocomplete de TypeScript para:
- event.key
- event.target.value
- event.preventDefault()
- etc.

**¿Por qué esta función?**
Mejor UX - usuarios esperan que Enter envíe la búsqueda sin hacer clic.

## Component Render

```typescript
<div className="search-container">
    <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
    />
    <button onClick={handleSearch}>
        {buttonTitle}
    </button>
</div>
```

### Controlled Input
Nota tres cosas:

1. **value={query}**
   - El input siempre muestra el valor desde el estado
   - React es dueño del valor, no el DOM

2. **onChange={(event) => setQuery(event.target.value)}**
   - Cuando el usuario escribe, actualiza estado con el nuevo valor
   - event.target.value contiene lo que el usuario escribió

3. **onKeyDown={handleKeyDown}**
   - Escucha eventos de teclado (específicamente tecla Enter)

### ¿Por qué Controlled Inputs?
✅ Única fuente de verdad (estado de React)
✅ Fácil de validar, formatear, o transformar input
✅ Puede establecer valor programáticamente
✅ Más fácil de testear

**Alternativa - Uncontrolled Input (no usado aquí):**
```typescript
<input type="text" ref={inputRef} />
// Luego usar inputRef.current.value para obtener el valor
```

## Conceptos Clave Demostrados

### 1. Controlled Components
- Estado de React es la "única fuente de verdad"
- Valor del input siempre sincronizado con estado
- Más predecible y fácil de manipular

### 2. Debouncing
- Retrasa operaciones costosas (como llamadas a API)
- Mejora rendimiento y reduce carga del servidor
- Mejor experiencia de usuario (sin lag mientras escribe)

### 3. useEffect Hook
- Corre side effects después del render
- Reacciona a cambios de estado
- Limpia side effects para prevenir memory leaks

### 4. Cleanup Functions
- Cancela operaciones pendientes antes de que empiecen nuevas
- Previene memory leaks cuando el componente se desmonta
- Crítico para timers, subscripciones, y operaciones async

### 5. Event Handling
- onChange: Reacciona a input del usuario
- onClick: Reacciona a clics de botón
- onKeyDown: Reacciona a input del teclado
- TypeScript proporciona seguridad de tipos para eventos

## Errores Comunes a Evitar

❌ Olvidar cleanup en useEffect
- Resultado: Memory leaks, llamadas duplicadas a API

❌ Faltar dependencias en array de useEffect
- Resultado: Closures obsoletos, bugs con datos viejos

❌ No tipar event handlers apropiadamente
- Resultado: Sin autocomplete, potenciales errores en runtime

❌ Usar uncontrolled inputs cuando controlled es mejor
- Resultado: Más difícil de validar, testear, y gestionar

## Optimizaciones de Rendimiento Usadas

✅ Debouncing (700ms de delay antes de búsqueda)
- Reduce llamadas a API en ~90% para tipeo típico

✅ Cleanup functions
- Previene múltiples llamadas simultáneas a API

## Ejercicios para Probar

1. Agregar botón "Clear" que resetea query a string vacío
2. Cambiar tiempo de debounce a 1000ms y observar diferencia
3. Agregar spinner de carga que muestra durante espera de 700ms
4. Agregar validación de input (ej: mínimo 3 caracteres)
5. Agregar contador de caracteres mostrando caracteres restantes
6. Implementar dropdown de historial de búsqueda

## Resumen

SearchBar es un componente pequeño pero poderoso que muestra:
- Manejo avanzado de estado
- Optimización de rendimiento real
- Mejores prácticas de React
- TypeScript efectivo
- UX thoughtful
