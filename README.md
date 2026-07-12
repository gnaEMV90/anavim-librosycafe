# ANAVIM - Libros y Café

Showroom web simple, responsive y gratuito para **ANAVIM - Libros y Café**.

El sitio está pensado como primera versión online: presenta la marca, muestra categorías/productos destacados y deriva la atención a Instagram o WhatsApp. No incluye carrito, pagos ni backend.

## Stack

- Vite + React
- CSS simple organizado
- Sin backend
- Sin servicios pagos
- Deploy en Cloudflare Pages

## Estructura principal

```txt
public/
  favicon.svg
  logo-anavim.svg
  social-preview.svg
  robots.txt
  sitemap.xml
  _redirects
src/
  data/siteContent.js
  data/featuredImages.js
  featuredImages.css
  App.jsx
  main.jsx
  styles.css
```

## Editar contenido

La mayor parte del texto, contacto, categorías y productos destacados se edita en:

```txt
src/data/siteContent.js
```

Campos importantes:

- `whatsappNumber`: número real de WhatsApp, sin `+`, espacios ni guiones. Ejemplo: `5493532678034`.
- `whatsappMessage`: mensaje inicial que se abre en WhatsApp.
- `instagramUrl`: enlace oficial de Instagram.
- `email`: dejar vacío si no se quiere mostrar correo.
- `location`: ubicación visible.
- `featured`: tarjetas principales del showroom.
- `categories`: etiquetas de categorías visibles.
- `gallery`: textos de la galería visual.

Las imágenes principales del showroom están en:

```txt
src/data/featuredImages.js
```

## Ejecutar local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

La carpeta generada será:

```txt
dist
```

## Deploy en Cloudflare Pages

Configuración recomendada:

```txt
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
Production branch: main
Project name: anavim-librosycafe
```

URL esperada:

```txt
https://anavim-librosycafe.pages.dev
```

Cloudflare redeploya automáticamente cada vez que se suben cambios a `main`.

## Próximas mejoras sugeridas

1. Cargar fotos reales para promos y productos extras.
2. Agregar catálogo editable por JSON si crece la cantidad de productos.
3. Agregar filtros por categoría.
4. Agregar sección de promos activas.
5. Comprar dominio propio más adelante si aporta valor.

## Criterio del proyecto

Primero una web linda, liviana y funcional. Después catálogo. Después, recién si hace falta, se evalúa algo más grande. No conviene ponerle motor de Fórmula 1 a una bicicleta con canastito.
