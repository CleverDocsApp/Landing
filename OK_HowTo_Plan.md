# Plan: Página "OK How To" con Logo Búho Integrado

**Proyecto:** OnKlinic - Sección Educativa  
**Fecha:** 2025  
**Objetivo:** Crear una galería de videos educativos con el logo del búho "OK" como elemento central de branding

---

## CAMBIOS CLAVE EN EL BRANDING

### Nombre de la Página: "OK How To"

- El logo del búho "OK" (OK_web.png) funcionará como elemento visual principal
- Formato del título: [Logo Búho] + "How To" 
- El búho actúa como botón interactivo y elemento de marca distintivo
- Consistencia visual: usar el mismo esquema de colores del búho (teal/verde azulado) en toda la página

---

## 1. Arquitectura y Routing

### Implementar Sistema de Navegación Multi-Página

- Instalar y configurar React Router DOM (react-router-dom)
- Crear estructura de rutas: "/" para Home y "/how-to" para la nueva página
- Actualizar Header para incluir "How To" en el menú (entre Features y Pricing)
- Mantener estado del header scrolled en todas las páginas
- Transiciones suaves entre páginas con fade effects

### Configuración de Deployment

- Actualizar vite.config.ts para historyApiFallback
- Configurar netlify.toml con reglas de redirect para SPA
- Asegurar que refresh en /how-to funcione correctamente

---

## 2. Componente Hero con Logo Búho

### OKHowToHero Component

- Hero section con fondo gradiente similar al home (dark to light transition)
- Logo búho "OK" prominente y centrado (animado con efecto float)
- Texto "How To" con tipografía bold y gradiente teal
- El logo búho es clickeable y hace una animación divertida (guiño o giro)
- Subtítulo: "Learn everything you need to master OnKlinic" con animación de fade-in
- Estadísticas rápidas debajo: "50+ Tutorials", "10+ Hours", "Step by Step"

### Interactividad del Logo

- Hover: el búho hace un efecto de "levantamiento" sutil
- Click: animación de guiño/bounce
- Easter egg: después de 3 clicks, mensaje divertido del búho
- Integrar el logo en el scroll con parallax effect

---

## 3. Base de Datos Supabase

### Schema de Tablas

#### Tabla: video_categories

```sql
- id (uuid, primary key)
- name (text) - ej: "Getting Started"
- slug (text) - ej: "getting-started"
- description (text)
- icon_name (text) - nombre del icono de lucide-react
- color_primary (text) - color hex principal
- color_secondary (text) - color hex secundario
- display_order (integer)
- is_active (boolean)
- created_at (timestamp)
```

#### Tabla: tutorial_videos

```sql
- id (uuid, primary key)
- category_id (uuid, foreign key)
- title (text)
- description (text)
- video_url (text) - URL de YouTube/Vimeo
- thumbnail_url (text) - URL custom o auto de YouTube
- duration_seconds (integer)
- difficulty_level (enum: beginner, intermediate, advanced)
- tags (text[]) - array de strings
- display_order (integer)
- view_count (integer, default 0)
- is_featured (boolean)
- is_new (boolean) - auto-calculado si created_at < 30 días
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tabla: user_video_progress (opcional para tracking)

```sql
- id (uuid, primary key)
- user_id (uuid) - para usuarios logueados
- video_id (uuid, foreign key)
- watched_seconds (integer)
- completed (boolean)
- last_watched (timestamp)
```

### Funciones SQL

- `get_categories_with_count()` - devuelve categorías con cantidad de videos
- `get_videos_by_category(category_id)` - filtra por categoría
- `search_videos(query)` - búsqueda full-text
- `increment_view_count(video_id)` - incrementa vistas

---

## 4. Componentes Visuales Principales

### CategoryBrowser Component

- Layout de tabs horizontales con categorías
- Cada tab usa el icono y color de la categoría
- Indicador visual del tab activo con underline animado
- Responsive: en mobile se convierte en dropdown selector
- Animación de cambio entre categorías con fade/slide

### VideoGalleryGrid Component

- Grid CSS responsivo: 3 columnas (desktop), 2 (tablet), 1 (mobile)
- Cards con aspecto ratio 16:9 para thumbnails
- Skeleton loaders mientras carga desde Supabase
- Infinite scroll o paginación elegante
- Empty state atractivo cuando no hay videos

### VideoCardEnhanced Component

**Estructura de cada card:**

- Thumbnail con gradient overlay en hover
- Badge superior izquierda: nivel (Beginner/Intermediate/Advanced)
- Badge superior derecha: "New" o "Popular"
- Duración en esquina inferior derecha
- Título bold con 2 líneas máximo (ellipsis)
- Descripción corta en hover
- Play button circular centrado que aparece en hover
- Tags como pills pequeñas en la parte inferior
- Animación de elevación en hover

### VideoPlayerModal Component

- Modal full-screen con fondo oscuro semitransparente
- Reproductor de YouTube responsive (iframe con API)
- Sidebar con información del video (título, descripción completa, tags)
- Botones de navegación: anterior/siguiente dentro de la categoría
- Botón de cerrar prominente
- Progress bar del video
- "Mark as complete" checkbox
- Sección de "Related Videos" debajo
- Teclado: ESC para cerrar, flechas para navegar

### SearchBar Component

- Barra de búsqueda sticky en el top de la sección de videos
- Icono de lupa (Search de lucide-react)
- Placeholder: "Search tutorials..."
- Búsqueda en tiempo real con debounce (500ms)
- Muestra resultados mientras escribes
- Clear button cuando hay texto
- Filtros expandibles: duración, nivel, categoría

### FilterPanel Component

- Panel lateral colapsable (desktop) o bottom sheet (mobile)
- **Filtros por:**
  - Nivel: Beginner, Intermediate, Advanced (checkboxes)
  - Duración: < 5min, 5-10min, 10-20min, > 20min
  - Categoría: multi-select
  - Ordenar por: Recent, Popular, Duration, A-Z
- Contador de filtros activos
- "Clear all filters" button
- Aplica filtros con animación suave

---

## 5. Categorías de Videos (Datos Iniciales)

### 1. Getting Started (Color: Teal #20BDAA)

- **Icon:** Rocket
- **Videos:** "Welcome to OnKlinic", "First Login", "Interface Tour", "Basic Settings"

### 2. Creating Documentation (Color: Blue #3B82F6)

- **Icon:** FileText
- **Videos:** "Your First Note", "Using Templates", "Golden Thread Basics", "Saving & Exporting"

### 3. Advanced Features (Color: Purple #A855F7)

- **Icon:** Zap
- **Videos:** "Treatment Plan Validator", "Prior Authorization", "Dashboard Analytics", "Multi-user Setup"

### 4. Compliance & Security (Color: Orange #F97316)

- **Icon:** Shield
- **Videos:** "HIPAA Compliance", "Audit Reports", "Data Security", "Access Controls"

### 5. Tips & Shortcuts (Color: Pink #EC4899)

- **Icon:** Lightbulb
- **Videos:** "Keyboard Shortcuts", "Workflow Tips", "Custom Templates", "Time-Saving Tricks"

### 6. Troubleshooting (Color: Red #EF4444)

- **Icon:** AlertCircle
- **Videos:** "Common Issues", "Error Messages", "Contact Support", "FAQ"

---

## 6. Elementos Visuales Innovadores

### Logo Búho Animado

- Aparece en el hero con animación de "landing"
- Float animation continua (sutil)
- En scroll, el búho se "esconde" parcialmente (parallax)
- Versión mini del búho como mascota flotante (opcional)

### Transiciones y Microinteracciones

- Categorías con stagger animation al cargar
- Videos con cascade loading (uno tras otro rápidamente)
- Hover effects con scale y shadow elevation
- Play button con pulse animation
- Confetti cuando completas una categoría

### Progress Visualization

- Barra de progreso global en el top (% de videos vistos)
- Progress rings en cada categoría
- Achievement badges al completar hitos
- Visual timeline de tu learning path

### Efectos de Scroll

- Fade-in sections con Intersection Observer
- Parallax sutil en backgrounds
- Sticky category tabs
- Scroll-to-top button con el búho

---

## 7. Layout de la Página

### Estructura Principal

1. **Header** (compartido con home)
2. **OKHowToHero Section**
   - Logo búho animado
   - Título "How To"
   - Buscador principal
   - Stats rápidas
3. **CategoryTabs Section** (sticky)
   - Tabs horizontales con categorías
4. **VideoGallery Section**
   - Grid de video cards
   - Filtros laterales (desktop)
5. **Footer** (compartido con home)

### Responsive Breakpoints

- **Desktop (1280px+):** 3 columnas, sidebar filtros
- **Tablet (768-1279px):** 2 columnas, filtros en panel
- **Mobile (< 768px):** 1 columna, filtros en bottom sheet

---

## 8. Integración con Supabase

### Setup de Cliente

- Crear `supabaseClient.ts` con configuración
- Variables de entorno para URL y anon key
- Row Level Security policies para acceso público de lectura

### Hooks Personalizados

```typescript
useCategories() - Fetch categorías
useVideosByCategory(categoryId) - Videos por categoría
useSearchVideos(query, filters) - Búsqueda y filtrado
useVideoProgress(videoId) - Track progreso del usuario
useFeaturedVideos() - Videos destacados
```

### Estado y Caché

- React Query o SWR para caching inteligente
- Optimistic updates para views/progress
- Offline support con localStorage fallback

---

## 9. Animaciones con Framer Motion (opcional)

Si queremos animaciones súper smooth:

- Instalar framer-motion
- Page transitions
- Stagger children en grids
- Gestures en cards (drag to dismiss modal)
- Orchestrated animations en hero

---

## 10. Accesibilidad y Performance

### Accesibilidad

- ARIA labels en todos los controles
- Navegación por teclado completa
- Focus indicators visibles
- Screen reader announcements para cambios de estado
- Subtítulos en videos (cuando disponibles)

### Performance

- Lazy load de video thumbnails con Intersection Observer
- Code splitting por ruta (Home vs HowTo)
- Optimizar imágenes del búho en diferentes tamaños
- Prefetch de siguiente página de videos
- Debounce en búsqueda y filtros

### SEO

- Meta tags específicos para /how-to
- Schema markup para VideoObject
- Sitemap actualizado con nueva ruta
- Open Graph tags para compartir

---

## 11. Datos de Ejemplo para Demo

### Videos Placeholder

- Cada categoría con 4-6 videos
- Thumbnails automáticos de YouTube (usando IDs reales como ejemplo)
- Descripciones realistas
- Duraciones variadas: 2-15 minutos

### Estructura en Supabase

- Script SQL para poblar tablas
- Seed data con categorías y videos de muestra
- Facilitar actualización posterior con videos reales

---

## Flujo de Usuario

1. Usuario ve "How To" en el header con icono del búho miniatura
2. Click lleva a /how-to con transición fade
3. Hero muestra logo búho grande animado con "How To"
4. Usuario puede buscar inmediatamente o explorar categorías
5. Click en categoría muestra videos relevantes con animación
6. Click en video abre modal con reproductor
7. Puede navegar entre videos sin cerrar modal
8. Progreso se guarda automáticamente
9. Volver al home con header navigation

---

## Estructura de Archivos Final

```
src/
├── App.tsx (actualizar con Router)
├── pages/
│   ├── Home.tsx
│   └── HowTo.tsx
├── components/
│   ├── HowTo/
│   │   ├── OKHowToHero.tsx/.css
│   │   ├── CategoryBrowser.tsx/.css
│   │   ├── VideoGalleryGrid.tsx/.css
│   │   ├── VideoCardEnhanced.tsx/.css
│   │   ├── VideoPlayerModal.tsx/.css
│   │   ├── SearchBar.tsx/.css
│   │   ├── FilterPanel.tsx/.css
│   │   ├── ProgressTracker.tsx/.css
│   │   └── OwlMascot.tsx/.css
│   ├── Header/ (actualizar con How To link)
│   └── Footer/
├── services/
│   └── supabaseClient.ts
├── hooks/
│   ├── useCategories.ts
│   ├── useVideos.ts
│   ├── useSearch.ts
│   └── useVideoProgress.ts
├── types/
│   └── video.types.ts
└── lib/
    └── supabaseSetup.sql (script para crear tablas)
```

---

## Aspectos Únicos del Logo Búho

### Personalidad del Búho

- El búho representa sabiduría y aprendizaje
- Animaciones que refuerzan personalidad amigable
- Puede "reaccionar" a interacciones del usuario
- Guía visual del journey de aprendizaje

### Integración del Búho

- **Hero:** tamaño grande, protagonista
- **Header:** versión mini como identificador de página
- **Loading states:** búho animado
- **Empty states:** búho con mensaje
- **404 page:** búho confundido (future)

---

## Próximos Pasos

**Para implementar este plan:**

1. Cambiar a modo **BUILD** en la interfaz
2. Seleccionar "Implement this plan" 
3. La implementación seguirá el orden de las secciones:
   - Primero: Router y estructura de páginas
   - Segundo: Configuración de Supabase
   - Tercero: Componentes visuales
   - Cuarto: Funcionalidad e interacciones
   - Quinto: Optimizaciones y testing

---

## Beneficios del Diseño

- **Branding único:** El búho "OK" como mascota educativa memorable
- **UX superior:** Búsqueda, filtrado y navegación intuitiva
- **Performance:** Carga rápida con lazy loading y caching
- **Escalable:** Fácil agregar nuevas categorías y videos
- **Accesible:** Cumple con estándares WCAG
- **Engaging:** Animaciones y microinteracciones que deleitan

---

**Documento generado:** OK How To Plan  
**Versión:** 1.0  
**Listo para implementación**
