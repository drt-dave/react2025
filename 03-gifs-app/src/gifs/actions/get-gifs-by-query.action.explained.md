# getGifsByQuery - API Action - Explicación Completa

## Descripción General
Este archivo contiene una "action" - una función que interact con una API externa. En el contexto de esta aplicación, "actions" son funciones que:
- Hacen solicitudes HTTP a servicios externos
- Transforman respuestas de API a formatos específicos de la app
- Manejan lógica de obtención de datos
- Típicamente son funciones async

## Patrón Arquitectónico: Actions

Este sigue el patrón "Actions" donde las llamadas a API se separan de:
- Componentes (lógica UI)
- Hooks (lógica de gestión de estado)
- Configuración de API (base URL, headers, etc.)

## Beneficios de este Patrón

✅ **Responsabilidad Única**: Solo maneja obtención de datos
✅ **Reutilizable**: Puede llamarse desde múltiples lugares
✅ **Testable**: Fácil de mockear respuestas de API
✅ **Mantenible**: Cambios de API ocurren en un solo lugar
✅ **Type-Safe**: TypeScript asegura formas de datos correctas

## Conceptos de Aprendizaje
- Async/Await: Manejar operaciones asíncronas
- Solicitudes a API: Hacer llamadas HTTP
- Transformación de Datos: Convertir formato API a formato de app
- TypeScript Generics: Respuestas de API type-safe
- Array.map(): Transformar datos de array
- Destructuring & Mapping de Objetos
- Anotaciones de Tipo: Tipos de retorno Promise
- Conversión de Números: Type coercion

## El Código

```typescript
import type { GiphyResponse } from "../interface/giphy.response";
import type { Gif } from "../interface/gif.interface";
import { giphyApi } from "../api/giphy.api";

export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
    const response = await giphyApi<GiphyResponse>('/search', {
        params: {
            q: query,
            limit: 10,
        },
    });

    return response.data.data.map((gif) => ({
        id: gif.id,
        title: gif.title,
        url: gif.images.original.url,
        width: Number(gif.images.original.width),
        height: Number(gif.images.original.height),
    }))
};
```

## Desglose del Código

### Imports

```typescript
import type { GiphyResponse } from "../interface/giphy.response";
import type { Gif } from "../interface/gif.interface";
import { giphyApi } from "../api/giphy.api";
```

**¿Por qué dos tipos diferentes?**
- `GiphyResponse`: Lo que la API nos da (complejo, formato externo)
- `Gif`: Lo que nuestra app usa (simple, formato interno)

**Beneficios de la separación:**
✅ App no depende de estructura de API
✅ Si la API cambia, solo este archivo necesita actualizaciones
✅ Estructura de datos más simple para componentes
✅ Puede combinar datos de múltiples APIs

### Function Signature

```typescript
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
```

**Desglose:**
- `async`: Permite usar 'await' dentro
- `(query: string)`: Parámetro tipado
- `Promise<Gif[]>`: Tipo de retorno - Promise que eventualmente se resuelve a array de objetos Gif

### API Request

```typescript
const response = await giphyApi<GiphyResponse>('/search', {
    params: {
        q: query,
        limit: 10,
    },
});
```

**TypeScript Generic:**
```typescript
giphyApi<GiphyResponse>
```
Le dice a TypeScript: "Esta solicitud devolverá datos que coinciden con la interfaz GiphyResponse"

**URL Completa Construida:**
```
https://api.giphy.com/v1/gifs/search?q=cat&limit=10&lang=es&api_key=XXX
```

**Params Object:**
```typescript
{
    q: 'cat',      → ?q=cat
    limit: 10,     → &limit=10
}
```

**¿Por qué limit: 10?**
Buen balance entre:
✅ Tiempo de respuesta rápido (menos datos)
✅ Suficiente variedad para usuarios
✅ Uso razonable de API

**Await Keyword:**
Pausa la ejecución hasta que la solicitud HTTP se complete.
Sin await, 'response' sería una Promise, no los datos reales.

### Data Transformation

```typescript
return response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
    width: Number(gif.images.original.width),
    height: Number(gif.images.original.height),
}))
```

**¿Por qué response.data.data?**
- Primer `data` → Obtiene datos de respuesta Axios (el GiphyResponse)
- Segundo `data` → Accede a la propiedad 'data' de GiphyResponse (array de gifs)

**Array.map() Transformation:**
Toma cada objeto gif complejo de GIPHY y lo transforma en nuestro formato Gif más simple.

#### ANTES (Formato GIPHY):
```javascript
{
    id: "abc123",
    title: "Funny Cat GIF",
    images: {
        original: {
            url: "https://media.giphy.com/cat.gif",
            width: "480",      // ← ¡String!
            height: "360",     // ← ¡String!
            size: "1234567"
        },
        fixed_height: { ... },
        fixed_width: { ... },
        // ... 20+ otros tamaños de imagen
    },
    type: "gif",
    rating: "g",
    user: { ... },
    analytics: { ... },
    // ... muchas más propiedades que no necesitamos
}
```

#### DESPUÉS (Nuestro formato):
```javascript
{
    id: "abc123",
    title: "Funny Cat GIF",
    url: "https://media.giphy.com/cat.gif",
    width: 480,    // ← ¡Número!
    height: 360    // ← ¡Número!
}
```

**Beneficios de la transformación:**
✅ Objetos más pequeños (menos memoria)
✅ Más simple de usar en componentes
✅ Solo incluye lo que necesitamos
✅ Formato consistente en toda la app
✅ Más fácil de testear
✅ Si la API cambia, solo este archivo necesita actualizaciones

### Number Conversion

```typescript
width: Number(gif.images.original.width)
```

**¿Por qué la API devuelve String?**
Las APIs a menudo devuelven números como strings porque:
- Estándar JSON (todas las propiedades son strings)
- Compatibilidad hacia atrás
- Serialización más fácil

**¿Por qué convertir a Number?**
✅ Operaciones matemáticas funcionan: width * 2
✅ Consistencia de tipos en nuestra app
✅ Tipado apropiado de TypeScript
✅ Sin concatenación accidental de strings: width + height

**Function Number():**
```javascript
Number("480")  → 480
Number("abc")  → NaN (Not a Number)
Number("")     → 0
Number(null)   → 0
```

**Alternativas:**
```javascript
parseInt(gif.images.original.width, 10)
+gif.images.original.width  // unary plus
parseFloat(gif.images.original.width)
```

Number() es preferido porque:
- Maneja decimales
- Más explícito
- Comportamiento consistente

## Flujo de Interacción con API

```
1. ACCIÓN DE USUARIO
   Usuario escribe "cat" y presiona enter
   ↓

2. COMPONENTE LLAMA HOOK
   Componente llama: handleSearch('cat')
   ↓

3. HOOK LLAMA ACTION
   Hook llama: getGifsByQuery('cat')
   ↓

4. SOLICITUD HTTP
   Action hace solicitud a:
   GET https://api.giphy.com/v1/gifs/search?q=cat&limit=10&api_key=XXX
   ↓

5. API RESPONDE
   GIPHY devuelve JSON con 10 objetos GIF (formato complejo)
   ↓

6. TRANSFORMACIÓN DE DATOS
   Action transforma: GiphyResponse → Gif[]
   ↓

7. RETORNO AL HOOK
   Action devuelve: [{ id, title, url, width, height }, ...]
   ↓

8. HOOK ACTUALIZA ESTADO
   Hook llama: setGifs(gifs)
   ↓

9. COMPONENTE RE-RENDERIZA
   Componente muestra nuevos GIFs
```

## Manejo de Errores (No Implementado)

**Código Actual:**
Sin manejo de errores - si la API falla, la app se rompe.

**Versión Lista para Producción:**
```typescript
export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
    try {
        const response = await giphyApi<GiphyResponse>('/search', {
            params: { q: query, limit: 10 }
        });

        return response.data.data.map((gif) => ({
            id: gif.id,
            title: gif.title,
            url: gif.images.original.url,
            width: Number(gif.images.original.width),
            height: Number(gif.images.original.height),
        }));
    } catch (error) {
        console.error('Failed to fetch GIFs:', error);

        // Opción 1: Devolver array vacío
        return [];

        // Opción 2: Re-lanzar con error personalizado
        throw new Error(`Failed to search for "${query}"`);
    }
}
```

## Mejoras Posibles

### Parámetros Adicionales
```typescript
export const getGifsByQuery = async (
    query: string,
    limit: number = 10,
    rating: 'g' | 'pg' | 'pg-13' | 'r' = 'g'
): Promise<Gif[]> => { ... }
```

### Paginación
```typescript
export const getGifsByQuery = async (
    query: string,
    offset: number = 0
): Promise<{ gifs: Gif[]; total: number }> => { ... }
```

### Incluir Más Datos
```typescript
return response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
    width: Number(gif.images.original.width),
    height: Number(gif.images.original.height),
    rating: gif.rating,           // Agregar rating
    username: gif.username,        // Agregar creador
    trendingDate: gif.trending_datetime  // Agregar timestamp
}))
```

## Resumen

Esta action es un ejemplo perfecto de:
- Separación de concerns
- Transformación de datos
- Type safety con TypeScript
- Código limpio y mantenible
- Patrón Actions reutilizable
