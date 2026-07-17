# Panel administrador - ANAVIM

## Objetivo

Convertir la web actual de ANAVIM, que hoy funciona como showroom estático, en un showroom administrable con acceso privado.

La web seguirá sin vender online ni cobrar con pasarela de pago, pero permitirá cargar y mantener productos desde un panel interno.

## Alcance funcional esperado

### Sitio público

El visitante podrá ver productos publicados con:

- Nombre del producto.
- Código interno.
- Categoría.
- Descripción breve.
- Precio visible, si corresponde.
- Precio promocional, si corresponde.
- Estado de stock.
- Imagen.
- Etiquetas, por ejemplo: nuevo, destacado, promo, sin stock.
- Botón de consulta por WhatsApp.

El botón de consulta deberá abrir WhatsApp con un mensaje prearmado, incluyendo nombre y código del producto.

Ejemplo:

```txt
Hola ANAVIM, quiero consultar por este producto: Biblia infantil ilustrada (Código: BIB-001).
```

### Panel privado

El administrador podrá:

- Iniciar sesión en `/admin`.
- Crear productos.
- Editar productos.
- Activar o desactivar productos.
- Marcar productos como destacados.
- Cargar precio normal.
- Cargar precio promocional.
- Indicar si tiene stock.
- Definir categoría.
- Definir imagen mediante ruta o URL.
- Guardar cambios.

## Decisión técnica recomendada

Para que esto sea realmente administrable, no alcanza con archivos JSON locales, porque una web estática no puede escribir archivos por sí sola desde el navegador.

La recomendación es avanzar con:

```txt
Cloudflare Pages + Pages Functions + Cloudflare D1
```

### Por qué

- Mantiene el hosting gratuito o de muy bajo costo.
- No requiere servidor propio.
- Permite agregar API privada.
- Permite guardar productos en base de datos.
- Permite crecer después hacia catálogo más real sin armar un e-commerce completo.

## Arquitectura propuesta

```txt
Sitio público React
        |
        | GET /api/products
        v
Cloudflare Pages Functions
        |
        v
Cloudflare D1
```

```txt
Panel admin React /admin
        |
        | login + CRUD protegido
        v
/api/admin/products
        |
        v
Cloudflare D1
```

## Base de datos inicial

Tabla sugerida: `products`

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  price INTEGER,
  promo_price INTEGER,
  stock_status TEXT NOT NULL DEFAULT 'in_stock',
  image_src TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Estados de stock sugeridos

```txt
in_stock       Disponible
low_stock      Pocas unidades
out_of_stock   Sin stock
on_request     Consultar disponibilidad
```

## API pública

### Obtener productos visibles

```txt
GET /api/products
```

Devuelve productos activos para mostrar en la web pública.

## API privada

Todas las rutas privadas deben requerir sesión de administrador.

```txt
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

## Login privado

Primera etapa recomendada:

- Un solo usuario administrador.
- Contraseña guardada como variable de entorno en Cloudflare.
- Cookie segura de sesión.
- Ruta `/admin` protegida.

Variables necesarias:

```txt
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

Más adelante se puede mejorar con usuarios reales, roles o Cloudflare Access.

## Imágenes

Primera etapa recomendada:

- Seguir usando archivos en `public/images/productos/`.
- Desde el admin se carga la ruta de la imagen.

Ejemplo:

```txt
/images/productos/biblia-infantil-01.png
```

Esto evita sumar almacenamiento externo de entrada.

Más adelante, si se necesita subir imágenes desde el panel, evaluar Cloudflare R2 u otra alternativa.

## WhatsApp por producto

Cada producto debe generar un link dinámico:

```js
const message = `Hola ANAVIM, quiero consultar por este producto: ${product.name} (Código: ${product.code}).`
const href = `https://wa.me/5493532678034?text=${encodeURIComponent(message)}`
```

## Fases de implementación

### Fase 1 - Catálogo dinámico público

- Crear tabla D1.
- Crear `/api/products`.
- Adaptar la web para leer productos desde API.
- Mantener fallback básico si la API falla.

### Fase 2 - Panel privado básico

- Crear `/admin`.
- Crear login simple.
- Crear listado de productos.
- Crear alta y edición.

### Fase 3 - Mejoras de administración

- Filtros por categoría.
- Orden manual.
- Productos destacados.
- Promociones.
- Vista previa del producto.

### Fase 4 - Imágenes desde panel

- Evaluar carga directa de imágenes.
- Definir almacenamiento.
- Mantener costos controlados.

## Criterio de producto

No se implementa carrito ni pago online en esta etapa.

El botón principal sigue siendo consultar por WhatsApp, pero la consulta debe llegar con nombre y código del producto para que ANAVIM pueda responder rápido y sin confusión.
