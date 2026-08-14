# Heroes Finder Web

App web de portafolio que consulta un catálogo de héroes y villanos de DC y Marvel: explora el universo, busca por nombre con filtros avanzados, revisa estadísticas y poderes de cada personaje y guarda tus favoritos de forma persistente. Los datos los sirve una API NestJS ([`nest-heroes-backend`](https://github.com/Klerith/nest-heroes-backend)).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 6 + TypeScript (strict) |
| Estado | TanStack Query (server state) · Context API (favoritos en `localStorage`) |
| Estilos | Tailwind CSS v4 + shadcn/ui (Radix) |
| Routing | React Router 7 (`createBrowserRouter`, lazy loading) |
| Datos | API NestJS ([`nest-heroes-backend`](https://github.com/Klerith/nest-heroes-backend)) con 25 personajes semilla |
| HTTP | Axios |

## Progreso

| Fase | Estado |
|------|--------|
| **1. Scaffold & dominio** | ✅ Completo |
| **2. Catálogo + paginación + tabs** | ✅ Completo |
| **3. Detalle de personaje** | ✅ Completo |
| **4. Búsqueda + filtros avanzados** | ✅ Completo |
| **5. Favoritos persistentes** | ✅ Completo |
| **6. Testing automatizado** | 🚧 En proceso |

## Arranque rápido

```bash
# Requisitos: Node 20+, npm 10+

# 1. Levantar el backend (nest-heroes-backend) en el puerto 3000
#    (repo del curso: https://github.com/Klerith/nest-heroes-backend —
#    sirve /api/heroes con los datos semilla)
cd nest-heroes-backend
npm install
npm run start:dev

# 2. En otra terminal, levantar el frontend
cd 05-heroes-app
npm install

# Configurar la URL de la API (ya viene con el valor por defecto)
cp .env.template .env   # VITE_API_URL=http://localhost:3000

npm run dev
```

Abre http://localhost:5173 — la app consume `http://localhost:3000/api/heroes`.

> **Importante:** la app necesita el backend corriendo; sin él las consultas fallan y las tarjetas muestran el placeholder de imagen.

## Qué hace

| Capacidad | Descripción |
|-----------|-------------|
| `catalogo` | Grid de personajes con paginación (6 por página) y tabs por categoría: Todos, Héroes, Villanos y Favoritos, con contadores desde el resumen |
| `dashboard` | Tarjetas de estadísticas: total de personajes (héroes/villanos), % de favoritos, héroe más fuerte y más inteligente |
| `detalle` | Ficha completa del personaje: banner, nivel de poder, estadísticas (fuerza, inteligencia, velocidad, resistencia), poderes, equipo e información del universo |
| `busqueda` | Búsqueda por nombre (Enter o botón) + filtros avanzados (equipo, categoría, universo y estado con selects, fuerza mínima con slider) |
| `favoritos` | Lista persistente de favoritos guardada en `localStorage` (sin cuentas, sin backend), con contador y tab propia |

Detalle extra: el estado de la UI vive en los **query params de la URL** (`tab`, `page`, `limit`, `category`, `name`, `team`, `universe`, `status`, `strength`, ...), por lo que el filtro, la pestaña o la página actual se pueden compartir y sobreviven a la recarga.

## Arquitectura

Organizada por **dominio** (`heroes/`) con separación de responsabilidades:

- **`actions/`** — capa de acceso a datos: cada acción habla con la API y normaliza las URLs de imagen.
- **`hooks/`** — estado del servidor con TanStack Query: caché con `staleTime` de 5 min, estados de carga/error y reintentos desacoplados de la UI.
- **`context/`** — estado global de UI: favoritos encapsulados en el `FavoriteHeroProvider`, única fuente de verdad con persistencia en `localStorage`.
- **`components/`** — componentes de presentación (grid, tarjetas, stats) sobre primitivas de shadcn/ui (`components/ui/`).
- **`pages/` + `layouts/` + `router/`** — rutas con `createBrowserRouter`, layout compartido y lazy loading en la página de búsqueda.

La UI habla con los actions, nunca directo con Axios: cambiar la fuente de datos no toca la presentación.

## Estructura

```
src/
├── admin/                    # Área administrativa (placeholder; ruta desactivada en el router)
│   ├── layouts/AdminLayout.tsx
│   └── pages/AdminPage.tsx
├── heroes/                   # Dominio completo
│   ├── actions/              # Acciones de datos: get-hero, get-heroes-by-page, get-summary, search-hero
│   ├── api/hero.api.ts       # Cliente Axios (baseURL de VITE_API_URL)
│   ├── components/           # HeroGrid, HeroGridCard, HeroStats, HeroStatCard, SearchControls
│   ├── context/              # FavoriteHeroContext (favoritos en localStorage)
│   ├── hooks/                # useHeroInfo, useHeroSummary, usePaginatedHero, useSearchHero
│   ├── layouts/HeroesLayout.tsx
│   ├── pages/                # home/HomePage, hero/HeroPage, search/SearchPage
│   └── types/                # hero.interface, get-heroes.response, summary-information.response
├── components/
│   ├── custom/               # CustomBreadcrumbs, CustomJumbotron, CustomMenu, CustomPagination
│   └── ui/                   # shadcn/ui (accordion, badge, button, card, input, progress, slider, tabs, ...)
├── router/app.router.tsx     # Rutas: /, /heroes/:idSlug, /search (/admin comentada)
├── HeroesApp.tsx             # Providers (QueryClient + Favoritos) + Router
├── lib/utils.ts              # cn() — merge de clases Tailwind
└── main.tsx                  # Entry point
```

## Capacidades implementadas

- [x] **Catálogo paginado** — grid responsive 1/2/3 columnas con 6 personajes por página y navegación Anterior/Siguiente
- [x] **Tabs por categoría** — Todos / Héroes / Villanos / Favoritos con contadores desde `/summary`
- [x] **Dashboard de estadísticas** — total, héroes vs villanos, % de favoritos, más fuerte y más inteligente
- [x] **Detalle de personaje** — banner con imagen redonda, nivel de poder, badges de categoría/estado/universo y 4 pestañas de contenido
- [x] **Búsqueda por nombre** — con `useRef` (sin re-renders por tecleo), disparo con Enter o botón de búsqueda, y limpieza del filtro al vaciar el input
- [x] **Filtros avanzados** — equipo, categoría, universo y estado con selects funcionales que viven en la URL, y fuerza mínima con slider
- [x] **Favoritos persistentes** — Context API + `localStorage` (corrupt-safe por parse con fallback a `[]`)
- [x] **Estado en la URL** — tabs, página y filtros viven en query params (compartibles y persistentes)
- [x] **Caché de servidor** — TanStack Query con `staleTime` de 5 min y `retry: false` controlado
- [ ] **Testing automatizado** — 🚧 en proceso de implementación

## Comandos de calidad

```bash
npm run dev      # servidor de desarrollo (Vite)
npm run build    # typecheck (tsc -b) + build de producción (valida el frontend)
npm run lint     # ESLint
npm run preview  # previsualizar el build de producción
```

## Notas de desarrollo

- Los datos provienen de [`nest-heroes-backend`](https://github.com/Klerith/nest-heroes-backend) (repo del curso): 25 personajes semilla con imagen servida por el propio backend (`VITE_API_URL/images/...`).
- Convención de commits: conventional commits, una unidad de trabajo revisable por commit.
- Query params como `?page=2&tab=heroes` mantienen el estado de la navegación compartible por URL.
- La UI está en español, pero los query params conservan los valores canónicos del backend (p. ej. `category=Hero`, `status=Active`) para que la búsqueda funcione y las URLs sean compartibles.