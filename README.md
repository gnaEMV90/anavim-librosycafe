# ANAVIM - Libros y Café

Showroom web simple, responsive y gratuito para **ANAVIM - Libros y Café**.

## Stack

- Vite + React
- CSS simple organizado
- Sin backend
- Listo para Cloudflare Pages

## Estructura principal

```txt
public/
  favicon.svg
  logo-anavim.svg
  social-preview.svg
  _redirects
src/
  data/siteContent.js
  App.jsx
  main.jsx
  styles.css
```

## Editar contenido

La mayor parte del texto, contacto, categorías y productos destacados se edita en:

```txt
src/data/siteContent.js
```

Puntos importantes a reemplazar:

- `whatsappNumber`: número real de WhatsApp, sin `+`, espacios ni guiones.
- `email`: correo real si corresponde.
- `location`: ubicación visible.
- Textos de productos destacados.
- Galería: reemplazar luego por fotos reales si se agregan imágenes.

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

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Nombre sugerido del proyecto: `anavim-librosycafe`

URL esperada:

```txt
https://anavim-librosycafe.pages.dev
```

## Próximas mejoras sugeridas

- Reemplazar placeholders visuales por fotos reales de Instagram o fotos propias.
- Agregar catálogo editable por JSON.
- Agregar filtro por categorías.
- Agregar sección de promos activas.
- Agregar dominio propio si más adelante se compra uno.
