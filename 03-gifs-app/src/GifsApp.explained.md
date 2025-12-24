# GifsApp Component - Explicación Completa

## Descripción General
Este es el componente principal de la aplicación de búsqueda de GIFs. Orquesta todos los componentes hijos y gestiona el estado de la aplicación a través de un hook personalizado.

## Conceptos de Aprendizaje
- **Component Composition**: Dividir la UI en piezas pequeñas y reutilizables
- **Custom Hooks**: Separar la lógica de negocio de los componentes UI
- **Props**: Pasar datos y funciones a componentes hijos
- **TypeScript**: Seguridad de tipos para parámetros de función

## Estructura del Código

### Imports
```typescript
import { CustomHeader } from './shared/components/CustomHeader'
import { SearchBar } from './shared/components/SearchBar'
import { PreviousSearches } from './gifs/components/PreviousSearches'
import { GifList } from './gifs/components/GifList'
import { useGif } from './gifs/hooks/useGif'
```

Importamos todos los componentes necesarios y el hook personalizado que gestiona la lógica de GIFs.

### Component Function

```typescript
export const GifsApp = () => {
    const {
        gifs,              // Array de objetos GIF desde la API
        previousTerms,     // Array de términos de búsqueda anteriores
        handleSearch,      // Función para realizar nueva búsqueda
        handleTermClicked  // Función para re-buscar un término anterior
    } = useGif();
```

#### Custom Hook - useGif()
El hook `useGif` encapsula toda la lógica de estado para:
- Almacenar la lista de GIFs desde la API
- Llevar registro de términos de búsqueda anteriores
- Manejar nuevas búsquedas
- Manejar clics en términos de búsqueda anteriores

Este es un patrón común de React llamado "Custom Hooks" que permite reutilizar lógica con estado en diferentes componentes.

### Estructura del Componente

El componente está dividido en 4 secciones principales:

#### 1. CustomHeader
```typescript
<CustomHeader
    title='Buscador de gifs'
    description='Descubre y comparte el Gif perfecto'
/>
```
- Muestra el título y descripción de la aplicación
- Las props pasan datos del padre al hijo
- Las props son de solo lectura y fluyen en una dirección (top-down)

#### 2. SearchBar
```typescript
<SearchBar
    placeholder='Buscar Gif'
    buttonTitle='Buscar'
    onQuery={(query: string) => handleSearch(query)}
/>
```

**Callback Functions (Funciones de Callback):**
- `onQuery` recibe una función que será llamada cuando el usuario envíe una búsqueda
- Esto se llama "lifting state up" - el componente hijo no maneja qué pasa con la búsqueda
- Solo notifica al padre que se solicitó una búsqueda

**TypeScript:**
- `(query: string) => handleSearch(query)` - Tipamos explícitamente `query` como string
- Esto previene bugs garantizando que solo se pasen strings

#### 3. PreviousSearches
```typescript
<PreviousSearches
    searches={previousTerms}
    onLabelClicked={handleTermClicked}
/>
```
- Muestra labels clicables de términos de búsqueda anteriores
- Mejora la UX permitiendo re-ejecutar búsquedas rápidamente
- `onLabelClicked` maneja los clics en las etiquetas

#### 4. GifList
```typescript
<GifList
    gifs={gifs}
/>
```
- Muestra la cuadrícula de imágenes GIF devueltas desde la API
- Internamente mapea sobre el array `gifs` para renderizar items individuales
- Patrón común llamado "list rendering"

## Conceptos Clave de React

### 1. Component Composition
- Dividir la UI en componentes más pequeños y enfocados
- Cada componente tiene una única responsabilidad

### 2. Props
- Pasar datos de componentes padre a hijo
- Pasar funciones como props (patrón callback)

### 3. Custom Hooks
- Extraer lógica con estado en funciones reutilizables
- Mantener los componentes limpios y enfocados en renderizar

### 4. One-Way Data Flow (Flujo de datos unidireccional)
- Los datos fluyen hacia abajo mediante props
- Los eventos fluyen hacia arriba mediante funciones callback

### 5. TypeScript Benefits
- Seguridad de tipos en parámetros de función (query: string)
- Auto-completado y detección de errores en tu IDE
- Código auto-documentado mediante tipos

## Pasos Siguientes para Aprender

Para entender completamente este componente, deberías explorar:
1. La implementación del hook personalizado `useGif`
2. Cómo está estructurado cada componente hijo
3. Cómo funcionan las llamadas a la API para obtener GIFs
4. Cómo las actualizaciones de estado desencadenan re-renders
