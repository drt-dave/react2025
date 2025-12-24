# PreviousSearches Component - Explicación Completa

## Descripción General
Este componente muestra una lista de términos de búsqueda anteriores como items clicables. Cuando un usuario hace clic en un término, dispara una nueva búsqueda sin tener que escribir.

## Tipo de Componente
Este es un "componente presentacional" que:
- Recibe datos vía props (no obtiene datos por sí mismo)
- Maneja interacciones de usuario vía callback props
- Se enfoca puramente en renderizar UI
- No tiene estado interno
- Es altamente reutilizable

## Experiencia de Usuario
En lugar de escribir la misma búsqueda nuevamente, los usuarios pueden:
- Ver sus búsquedas recientes de un vistazo
- Hacer clic en cualquier término para re-buscar instantáneamente
- Explorar rápidamente consultas anteriores

## Conceptos de Aprendizaje
- List Rendering: Usar .map() para renderizar arrays
- Keys in Lists: Usar identificadores únicos para rendimiento
- Event Handlers: onClick con arrow functions
- Callback Props: Comunicar de hijo a padre
- FC (FunctionComponent): Tipado de componentes TypeScript
- Semantic HTML: Usar elementos HTML apropiados (ul, li)
- Inline Event Handlers: Crear funciones dentro de JSX

## El Código

```typescript
import type { FC } from "react";

interface Props {
    searches: string[];
    onLabelClicked: (term: string) => void;
}

export const PreviousSearches: FC<Props> = ({ searches, onLabelClicked }) => {
    return (
        <div className="previous-searches">
            <h2>Búsquedas previas</h2>
            <ul className="previous-searches-list">
                {searches.map((term) => (
                    <li
                        key={term}
                        onClick={() => onLabelClicked(term)}
                    >
                        {term}
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Props Interface

```typescript
interface Props {
    searches: string[];
    onLabelClicked: (term: string) => void;
}
```

### searches - Array de términos anteriores
```typescript
searches: string[]
```

**Tipo:** Array de strings, cada uno representando un término de búsqueda

**Ejemplo de datos:**
```javascript
['cat', 'dog', 'funny', 'dance', 'meme']
```

**Orden:** Típicamente ordenado de más reciente a más antiguo

**Longitud máxima:** Limitado a 8 items en el hook useGif

**Array vacío:** Si no hay búsquedas aún, será `[]` y el componente renderizará lista vacía

### onLabelClicked - Callback function
```typescript
onLabelClicked: (term: string) => void
```

**Patrón "callback props"** - el componente padre (GifsApp) pasa una función que el hijo (este componente) puede llamar cuando algo sucede (un clic).

**Flujo de datos:**
1. Usuario hace clic en "cat" en la lista
2. Este componente llama: `onLabelClicked('cat')`
3. Padre (GifsApp) recibe la llamada vía handleTermClicked
4. Padre dispara nueva búsqueda para "cat"

**¿Por qué este patrón?**
- "Lifting state up" - padre controla qué sucede
- Este componente no necesita saber sobre llamadas a API
- Hace componente reutilizable (funciona con cualquier callback)
- Responsabilidad Única: este componente solo muestra y notifica

## List Rendering

```typescript
{searches.map((term) => (
    <li key={term} onClick={() => onLabelClicked(term)}>
        {term}
    </li>
))}
```

### ¿Cómo funciona .map()?

Transforma el array de searches en array de elementos `<li>`.

**Ejemplo:**
```javascript
// Si searches = ['cat', 'dog', 'bird']

// React llama la función 3 veces:
// 1. term = 'cat'  → <li key="cat" onClick={...}>cat</li>
// 2. term = 'dog'  → <li key="dog" onClick={...}>dog</li>
// 3. term = 'bird' → <li key="bird" onClick={...}>bird</li>

// Resultado: 3 elementos <li> renderizados en el DOM
```

### Manejo de Array Vacío
```javascript
// Si searches = []
// .map() devuelve array vacío
// No se renderizan elementos <li>
// Usuario solo ve el encabezado
```

Podrías agregar:
```typescript
{searches.length === 0 && <p>No hay búsquedas aún</p>}
```

## Keys en Lists

```typescript
key={term}
```

### ¿Por qué son necesarias las keys?

React usa keys para identificar qué items han cambiado, sido agregados, o eliminados. Sin keys, React re-renderizaría toda la lista en cada cambio.

### ¿Es seguro usar string como key?

En este caso, SÍ, porque:
✅ Los términos de búsqueda son únicos (useGif previene duplicados)
✅ Los términos son estables (no cambian una vez agregados)
✅ Valores de string simples

### ¿Por qué NO usar índice?

```typescript
key={index}  // ❌ Sería problemático
```

Sería problemático porque:
❌ Si la lista se reordena, las keys no coinciden con los items
❌ Si un item se elimina, los índices cambian
❌ React piensa que diferentes items cambiaron

**Ejemplo del problema con índice:**
```javascript
// Antes de eliminar: ['cat', 'dog', 'bird']
//   <li key={0}>cat</li>
//   <li key={1}>dog</li>
//   <li key={2}>bird</li>

// Después de eliminar 'dog': ['cat', 'bird']
//   <li key={0}>cat</li>  ✅ Mismo
//   <li key={1}>bird</li> ❌ ¡Cambió! Era 'dog', ahora 'bird'

// React piensa: "Item en índice 1 cambió de dog a bird"
// ¡Re-render innecesario!
```

**Con key estable (term):**
```javascript
// Antes:
//   <li key="cat">cat</li>
//   <li key="dog">dog</li>
//   <li key="bird">bird</li>

// Después de eliminar 'dog':
//   <li key="cat">cat</li>   ✅ Misma key
//   <li key="bird">bird</li> ✅ Misma key

// React sabe: "dog fue eliminado, cat y bird no cambiaron"
// ¡Re-render óptimo!
```

## Event Handler con Parámetros

```typescript
onClick={() => onLabelClicked(term)}
```

### ¿Por qué arrow function?

**NECESITAMOS** el wrapper de arrow function porque queremos pasar el parámetro 'term' a onLabelClicked.

**❌ INCORRECTO - Llamaría inmediatamente en render:**
```typescript
onClick={onLabelClicked(term)}
```
Esto ejecuta la función durante el render, ¡no en el clic!
Resultado: Todas las búsquedas se disparan inmediatamente cuando la página carga

**✅ CORRECTO - Crea función para llamar después:**
```typescript
onClick={() => onLabelClicked(term)}
```
Esto crea una NUEVA función que será llamada cuando el usuario haga clic.

### Flujo de Ejecución
1. Componente renderiza
2. Arrow function es creada pero NO ejecutada
3. Usuario hace clic en el `<li>`
4. React llama la arrow function
5. Arrow function llama `onLabelClicked(term)`
6. handleTermClicked del padre recibe el término
7. Padre dispara nueva búsqueda

### Concepto de Closure
Cada arrow function "cierra sobre" (closes over) la variable 'term' de su iteración de .map(). Esto se llama closure.

**Ejemplo con 3 términos:**
```javascript
// Primera <li>: () => onLabelClicked('cat')
// Segunda <li>: () => onLabelClicked('dog')
// Tercera <li>: () => onLabelClicked('bird')

// ¡Cada función recuerda su valor específico de 'term'!
```

## Semantic HTML

```typescript
<h2>Búsquedas previas</h2>
<ul className="previous-searches-list">
    <li>...</li>
</ul>
```

### ¿Por qué `<ul>` en lugar de `<div>`?

**Con `<ul>` (semantic HTML):**
✅ Significado semántico: "Esta es una lista de items"
✅ Lectores de pantalla anuncian: "Lista con X items"
✅ Estilos de lista integrados (bullets, aunque CSS puede sobreescribir)
✅ Mejor accesibilidad
✅ Estructura apropiada del documento

**Alternativas:**
- `<ol>` (ordered list) - si el orden importa (1, 2, 3...)
- `<div>` - menos semántico, pero funciona

## Mejoras de Accesibilidad

**Implementación actual:**
⚠️ Items de lista con onClick no son accesibles por teclado
⚠️ Lectores de pantalla no los anuncian como interactivos

**Versión mejorada con botón:**
```typescript
<li key={term}>
    <button
        onClick={() => onLabelClicked(term)}
        aria-label={`Buscar de nuevo por ${term}`}
    >
        {term}
    </button>
</li>
```

**O hacer `<li>` accesible:**
```typescript
<li
    key={term}
    onClick={() => onLabelClicked(term)}
    onKeyDown={(e) => e.key === 'Enter' && onLabelClicked(term)}
    tabIndex={0}
    role="button"
    aria-label={`Buscar por ${term}`}
>
    {term}
</li>
```

**Beneficios:**
✅ Navegación por teclado con Tab
✅ Activación con Enter/Espacio
✅ Lectores de pantalla anuncian como botón
✅ ARIA label proporciona contexto
✅ role="button" clarifica el propósito

## Resumen

Este componente es un excelente ejemplo de:
- Componente presentacional sin estado
- List rendering con .map()
- Importancia de keys para rendimiento
- Callback props para comunicación
- Event handlers con closures
- Semantic HTML para accesibilidad
