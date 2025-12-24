# useGif - Custom Hook - Explicación Completa

## ¿Qué es un Custom Hook?

Un custom hook es una función JavaScript que:
- Empieza con "use" (convención/requisito de React)
- Puede usar otros hooks de React (useState, useEffect, useRef, etc.)
- Encapsula lógica reutilizable
- Devuelve valores y funciones que los componentes pueden usar

## ¿Por qué usar Custom Hooks?

✅ Separar lógica de negocio de componentes UI
✅ Hacer lógica reutilizable entre componentes
✅ Más fácil de testear (testear lógica independientemente de UI)
✅ Código de componentes más limpio (componentes se enfocan en renderizar)
✅ Principio de Responsabilidad Única (SRP)

## Conceptos de Aprendizaje
- Custom Hooks: Crear lógica con estado reutilizable
- useState: Gestionar estado del componente
- useRef: Persistir valores entre renders sin causar re-renders
- Caching: Almacenar resultados de API para evitar solicitudes duplicadas
- Async/Await: Manejar operaciones asíncronas
- TypeScript Generics: Estado y refs con seguridad de tipos

## Estructura del Código

### Imports
```typescript
import { useRef, useState } from "react";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";
import type { Gif } from "../interface/gif.interface";
```

### State Management

#### 1. Estado de GIFs
```typescript
const [gifs, setGifs] = useState<Gif[]>([])
```

**TypeScript Generic Syntax:**
- `useState<Gif[]>([])` - TypeScript necesita saber que esto contendrá objetos Gif
- Sin tipar: `useState([])` - TypeScript pensaría: never[]
- Con tipado: `useState<Gif[]>([])` - TypeScript sabe: Gif[]

**Beneficios:**
- setGifs solo acepta Gif[] (seguridad de tipos)
- Auto-completado al acceder propiedades de gif
- Detecta errores en tiempo de compilación

#### 2. Estado de Términos Anteriores
```typescript
const [previousTerms, setPreviousTerms] = useState<string[]>([])
```

- Almacena historial de búsquedas (máximo 8)
- Orden: Búsquedas más recientes primero

### Caching con useRef

```typescript
const gifsCache = useRef<Record<string, Gif[]>>({})
```

#### ¿Qué es useRef?
useRef crea un objeto mutable que persiste entre renders pero NO causa re-renders cuando cambia.

#### Record Type Explicado
```typescript
Record<string, Gif[]>
```
Equivale a:
```typescript
{
    [key: string]: Gif[]
}
```

**Ejemplo de datos en cache:**
```javascript
{
    'cat': [gif1, gif2, gif3],
    'dog': [gif4, gif5],
    'funny': [gif6, gif7, gif8]
}
```

#### ¿Por qué useRef en vez de useState?

**CON useState:**
```typescript
const [cache, setCache] = useState({})
```
✅ Causa re-render cuando se actualiza
❌ Re-render innecesario (cache no se muestra)
❌ Impacto en rendimiento

**CON useRef:**
```typescript
const cache = useRef({})
```
✅ NO causa re-render cuando se actualiza
✅ Perfecto para datos en segundo plano
✅ Mejor rendimiento
✅ Persiste entre renders

**Accediendo al valor:**
- useState: usa el valor directamente → `cache`
- useRef: debe usar `.current` → `gifsCache.current`

**¿Por qué `.current`?**
useRef devuelve un objeto: `{ current: yourValue }`
El valor real está almacenado en la propiedad 'current'

**Mutación está OK:**
A diferencia del estado, PUEDES mutar valores ref directamente:
```typescript
gifsCache.current['cat'] = [gif1, gif2]  // ✅ Esto está bien!
```

## Event Handlers

### 1. handleTermClicked
```typescript
const handleTermClicked = async (term: string) => {
    // Verificar cache
    if (gifsCache.current[term]) {
        setGifs(gifsCache.current[term]);
        return;  // Early return - no hacer llamada a API
    }

    // Si no está en cache, obtener de API
    const gifs = await getGifsByQuery(term);
    setGifs(gifs);
};
```

**Flujo:**
1. Usuario hace clic en término anterior (ej: "cat")
2. Verificar si tenemos resultados cacheados para "cat"
3. Si está cacheado: Usar resultados cacheados (instantáneo, sin llamada a API)
4. Si no está cacheado: Obtener de API
5. Actualizar GIFs mostrados

**Beneficios del Caching:**
✅ Resultados instantáneos (sin tiempo de carga)
✅ Reduce llamadas a API (ahorra dinero/límites de tasa)
✅ Mejor experiencia de usuario
✅ Funciona offline (si previamente cacheado)
✅ Reduce carga del servidor

### 2. handleSearch
```typescript
const handleSearch = async (query: string) => {
    // 1. Sanitizar entrada
    query = query.trim().toLocaleLowerCase();

    // 2. Validar query vacío
    if (query.length === 0) return;

    // 3. Verificar duplicados
    if (previousTerms.includes(query)) return;

    // 4. Actualizar historial de búsqueda
    setPreviousTerms([query, ...previousTerms].splice(0, 8));

    // 5. Obtener datos de API
    const gifs = await getGifsByQuery(query);

    // 6. Actualizar GIFs mostrados
    setGifs(gifs);

    // 7. Cachear los resultados
    gifsCache.current[query] = gifs;
};
```

#### Paso 1: Sanitización de Entrada
```typescript
query = query.trim().toLocaleLowerCase();
```

- `trim()`: Elimina espacios de ambos lados ("  cat  " → "cat")
- `toLocaleLowerCase()`: Convierte a minúsculas respetando locales ("CAT" → "cat")

**¿Por qué toLowerCase?**
- Hace comparaciones más fáciles ("Cat" === "cat")
- Mejores hits de cache (no cachear "Cat" y "cat" por separado)
- Muestra consistente del historial de búsqueda

#### Paso 2: Validación
```typescript
if (query.length === 0) return;
```

**Early Return Pattern:**
- Si inválido, salir inmediatamente
- Previene ejecución de código innecesaria

#### Paso 3: Verificación de Duplicados
```typescript
if (previousTerms.includes(query)) return;
```

- `.includes()`: Verifica si elemento existe en el array
- Previene entradas duplicadas en historial

#### Paso 4: Actualizar Historial
```typescript
setPreviousTerms([query, ...previousTerms].splice(0, 8));
```

**Desglose:**
```typescript
[query, ...previousTerms]
//  ↑         ↑
// nuevo   ...spread de términos existentes

.splice(0, 8)
// Mantener solo 8 items
```

**Ejemplo paso a paso:**
```javascript
// Antes: previousTerms = ['dog', 'bird']
// Nuevo query: 'cat'

// Paso 1 - Crear nuevo array con query primero:
['cat', 'dog', 'bird']

// Paso 2 - Limitar a 8 items:
['cat', 'dog', 'bird']  // (ya menos de 8, sin cambios)

// Si tuviéramos 8 términos y agregáramos uno 9no:
['cat', 't1', 't2', 't3', 't4', 't5', 't6', 't7'] // t8 eliminado (más antiguo)
```

#### Paso 5: Fetch de API
```typescript
const gifs = await getGifsByQuery(query);
```

- Operación async que hace solicitud HTTP a API de GIPHY
- Espera respuesta
- Parsea y devuelve array de objetos Gif

#### Paso 6: Actualizar Estado
```typescript
setGifs(gifs);
```

- Actualiza los GIFs mostrados con resultados frescos

#### Paso 7: Cachear Resultados
```typescript
gifsCache.current[query] = gifs;
```

**Mutación Directa:**
- Muta directamente el objeto ref (¡OK para refs!)
- Cuando usuario haga clic en este término después, mostrar instantáneamente

## Hook Return Value

```typescript
return {
    gifs,              // Array de objetos GIF a mostrar
    previousTerms,     // Historial de búsqueda
    handleSearch,      // Función para nueva búsqueda
    handleTermClicked, // Función para re-ejecutar búsqueda anterior
}
```

**Uso en Componente:**
```typescript
const { gifs, previousTerms, handleSearch, handleTermClicked } = useGif()
```

**Patrón Return Object:**
Mejor que devolver array como useState porque:
✅ Auto-documentado (nombres claros)
✅ Puede desestructurar solo lo que necesitas
✅ El orden no importa
✅ Fácil agregar más valores después

## Conceptos Clave

### 1. Custom Hooks
- Extraer lógica reutilizable de componentes
- Debe empezar con "use"
- Puede usar otros hooks dentro
- Devuelve valores y funciones

### 2. useState vs useRef
- useState: Causa re-renders, para datos mostrados
- useRef: Sin re-renders, para datos en segundo plano
- Refs persisten entre renders
- Refs pueden mutarse directamente

### 3. Estrategia de Caching
- Almacenar resultados de API para evitar solicitudes duplicadas
- Estructura key-value (tipo Record)
- Verificar cache antes de llamada a API
- Balancear memoria vs rendimiento

### 4. Async/Await
- Manejar operaciones asíncronas limpiamente
- Hace código async parecer síncrono
- Debe marcar función como async
- Await pausa ejecución hasta que promise se resuelve

## Mejoras Potenciales

### 1. Manejo de Errores
```typescript
try {
    const gifs = await getGifsByQuery(query);
    setGifs(gifs);
} catch (error) {
    console.error('Failed to fetch GIFs:', error);
    // Mostrar mensaje de error al usuario
}
```

### 2. Estados de Carga
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
        const gifs = await getGifsByQuery(query);
        setGifs(gifs);
    } finally {
        setIsLoading(false);
    }
}
```

### 3. Gestión de Cache
- Limitar tamaño total de cache
- Implementar evicción LRU (Least Recently Used)
- Expiración de cache (datos obsoletos)
- Persistir cache en localStorage

## Resumen

Este hook es un excelente ejemplo de:
- Separación de concerns (lógica separada de UI)
- Reutilización de código
- Optimización de rendimiento (caching)
- Gestión de estado compleja
- Patrones modernos de React
