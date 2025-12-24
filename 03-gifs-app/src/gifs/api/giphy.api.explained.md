# Giphy API Configuration - Explicación Completa

## Descripción General
Este archivo crea y exporta un cliente HTTP Axios preconfigurado específicamente para hacer solicitudes a la API de GIPHY. Este es un patrón común en aplicaciones React para organizar llamadas a API.

## ¿Por qué crear una instancia personalizada de Axios?

En lugar de usar axios directamente en cada action/componente, creamos una instancia configurada con:
- Base URL (no repetirla en cada solicitud)
- Parámetros por defecto (API key, idioma)
- Headers por defecto (si se necesitan)
- Interceptors para request/response (si se necesitan)
- Settings de timeout (si se necesitan)

## Beneficios de este Enfoque

✅ **DRY (Don't Repeat Yourself)** - Configuración en un solo lugar
✅ **Consistencia** - Todas las solicitudes usan los mismos settings
✅ **Mantenibilidad** - Cambiar API key o URL en un solo lugar
✅ **Testabilidad** - Fácil de mockear este módulo en tests
✅ **Escalabilidad** - Agregar interceptors, manejo de errores centralmente
✅ **Seguridad** - Variables de entorno protegen datos sensibles

## Conceptos de Aprendizaje
- Creación de Instancia Axios
- Configuración de Base URL
- Parámetros Por Defecto
- Variables de Entorno
- import.meta.env (específico de Vite)
- Gestión de API Key
- Configuración de Cliente HTTP

## El Código

```typescript
import axios from "axios";

export const giphyApi = axios.create({
    baseURL: 'https://api.giphy.com/v1/gifs',
    params: {
        lang: 'es',
        api_key: import.meta.env.VITE_GIPHY_API_KEY,
    },
});
```

### Base URL Configuration

```typescript
baseURL: 'https://api.giphy.com/v1/gifs'
```

**¿Qué hace?**
Automáticamente antepone esta URL a todas las solicitudes hechas con esta instancia.

**Ejemplo de uso:**
```typescript
giphyApi.get('/search')  // → GET https://api.giphy.com/v1/gifs/search
giphyApi.get('/trending') // → GET https://api.giphy.com/v1/gifs/trending
```

**Beneficios:**
- Menos repetición (principio DRY)
- Fácil cambiar versión de API (v1 → v2)
- Fácil cambiar entre entornos (dev, staging, prod)
- Código más limpio en archivos de actions

**Estructura de API de GIPHY:**
```
https://api.giphy.com/v1/gifs/
  ↑         ↑          ↑   ↑
  Protocol  Domain    Version  Resource
```

**Endpoints disponibles:**
- `/search` - Buscar GIFs
- `/trending` - GIFs en tendencia
- `/random` - GIF aleatorio
- `/{gif_id}` - Obtener GIF específico

### Default Parameters

```typescript
params: {
    lang: 'es',
    api_key: import.meta.env.VITE_GIPHY_API_KEY,
}
```

**¿Qué son Query Parameters?**
Pares key-value añadidos a la URL después de '?'
Formato: `?key1=value1&key2=value2`

**Ejemplo:**
```typescript
giphyApi.get('/search', { params: { q: 'cat', limit: 10 } })

// URL final:
// https://api.giphy.com/v1/gifs/search?q=cat&limit=10&lang=es&api_key=XXX
//                                        ↑                  ↑              ↑
//                                    Del request      De la config    De la config
```

#### Parámetro: lang

```typescript
lang: 'es'
```

**¿Qué hace?**
La API de GIPHY devuelve títulos y metadatos de GIF en el idioma especificado cuando está disponible.

**Idiomas soportados:**
- 'en' - Inglés (default)
- 'es' - Español
- 'pt' - Portugués
- 'fr' - Francés
- 'de' - Alemán
- 'it' - Italiano
- 'ja' - Japonés
- Y más...

**Ejemplo de efecto:**
- Búsqueda de "cat" con lang=es: Podría devolver "Gato Divertido"
- Búsqueda de "cat" con lang=en: Podría devolver "Funny Cat"

#### Parámetro: api_key

```typescript
api_key: import.meta.env.VITE_GIPHY_API_KEY
```

**¿Qué es import.meta.env?**
Vite (tu build tool) proporciona variables de entorno a través del objeto `import.meta.env`. Esta es sintaxis específica de Vite.

**Otros Build Tools:**
- Create React App: `process.env.REACT_APP_GIPHY_API_KEY`
- Next.js: `process.env.NEXT_PUBLIC_GIPHY_API_KEY`
- Vite: `import.meta.env.VITE_GIPHY_API_KEY`

**Reglas de Variables de Entorno de Vite:**
✅ Deben empezar con `VITE_` para exponerse al cliente
✅ Definidas en archivo .env en raíz del proyecto
✅ Type-safe con TypeScript (puedes definir tipos)

**Archivo .env de ejemplo:**
```env
VITE_GIPHY_API_KEY=abc123xyz789yourAPIkey
VITE_APP_NAME=GIF Search
VITE_API_BASE_URL=https://api.giphy.com
```

**¿Por qué el prefijo VITE_?**
¡Seguridad! Sin él, Vite NO expondrá la variable a tu código del lado del cliente. Esto previene exponer accidentalmente variables sensibles solo del servidor (como contraseñas de base de datos).

**Consideraciones de Seguridad:**

⚠️ IMPORTANTE: ¡Las API keys del lado del cliente son visibles para los usuarios!
Cualquiera puede abrir DevTools → tab Network y ver tu API key.

**Mejores Prácticas:**
✅ Usar API keys con restricciones de dominio (GIPHY permite esto)
✅ Usar keys con límites de tasa
✅ Nunca commitear archivo .env a Git (.gitignore it)
✅ Usar diferentes keys para dev/staging/producción
✅ Para operaciones sensibles, usar proxy de backend

**.gitignore debe incluir:**
```
.env
.env.local
.env.*.local
```

**Proveer .env.example:**
```env
VITE_GIPHY_API_KEY=your_api_key_here
```

Así otros desarrolladores saben qué variables se necesitan.

## Obtener una API Key de GIPHY

1. Ir a https://developers.giphy.com/
2. Crear una cuenta
3. Crear una nueva app
4. Copiar la API key
5. Agregar al archivo .env

**Límites de Tier Gratuito:**
- 42 solicitudes por hora por IP (con API key)
- 1000 solicitudes por día
- Headers de rate limit en respuesta

## Ejemplos de Uso

```typescript
import { giphyApi } from './api/giphy.api';

// Solicitud GET básica
const response = await giphyApi.get('/search', {
    params: { q: 'cat', limit: 10 }
});

// Shorthand (sin .get)
const response = await giphyApi('/search', {
    params: { q: 'dog' }
});

// Con TypeScript Generics
interface GiphyResponse {
    data: Gif[];
    meta: { status: number };
}

const response = await giphyApi.get<GiphyResponse>('/search', {
    params: { q: 'bird' }
});
// response.data está tipado como GiphyResponse
```

## Configuraciones Avanzadas (No Implementadas Aquí)

### Timeout
```typescript
export const giphyApi = axios.create({
    baseURL: '...',
    timeout: 5000,  // 5 segundos
});
```

### Custom Headers
```typescript
export const giphyApi = axios.create({
    baseURL: '...',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
```

### Request Interceptor
```typescript
giphyApi.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => Promise.reject(error)
);
```

### Response Interceptor
```typescript
giphyApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login
        }
        if (error.response?.status === 429) {
            // Handle rate limiting
        }
        return Promise.reject(error);
    }
);
```

## Checklist de Configuración de Entorno

1. **Crear archivo .env** (en raíz del proyecto):
   ```env
   VITE_GIPHY_API_KEY=your_actual_api_key_here
   ```

2. **Agregar a .gitignore:**
   ```
   .env
   .env.local
   .env.*.local
   ```

3. **Crear .env.example** (commitear esto):
   ```env
   VITE_GIPHY_API_KEY=your_api_key_here
   ```

4. **Obtener GIPHY API Key:**
   - Visitar https://developers.giphy.com/
   - Registrarse / Iniciar sesión
   - Crear nueva app
   - Copiar API key
   - Pegar en archivo .env

5. **Reiniciar servidor de desarrollo:**
   Vite solo carga .env al inicio
   Detener y reiniciar: `npm run dev`

6. **Verificar que funciona:**
   ```typescript
   console.log(import.meta.env.VITE_GIPHY_API_KEY);
   // Debe imprimir tu API key (en desarrollo)
   ```

## Resumen

Este archivo es un ejemplo perfecto de:
- Configuración centralizada
- Uso de variables de entorno
- Separación de concerns
- Seguridad básica de API
- Patrón reutilizable para otros servicios
