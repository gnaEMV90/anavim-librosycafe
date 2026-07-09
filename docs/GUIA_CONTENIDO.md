# Guía rápida de contenido - ANAVIM

Esta web está armada para que el contenido se pueda ajustar sin tocar casi nada de código.

## Archivo principal

```txt
src/data/siteContent.js
```

Ahí se editan:

- Nombre de marca.
- Frase principal.
- Textos del hero.
- Contacto.
- Categorías.
- Productos destacados.
- Textos de galería.
- Texto de la sección sobre ANAVIM.

## WhatsApp

El campo es:

```js
whatsappNumber: ''
```

Debe cargarse sin `+`, espacios ni guiones.

Ejemplo:

```js
whatsappNumber: '5493532678034'
```

Mientras esté vacío, la web deriva las consultas a Instagram para no dejar botones rotos.

## Instagram

El enlace oficial actual es:

```js
instagramUrl: 'https://www.instagram.com/anavim.librosycafe/'
```

## Email

Si no se quiere mostrar correo, dejarlo vacío:

```js
email: ''
```

Si más adelante se define un correo oficial:

```js
email: 'contacto@anavim.com.ar'
```

## Fotos reales

La primera versión usa fondos visuales generados con CSS para no depender de imágenes externas.

Cuando se quieran cargar fotos reales, conviene agregarlas en:

```txt
public/images/
```

Nombres sugeridos:

```txt
hero-anavim.jpg
galeria-libros.jpg
galeria-cafe.jpg
galeria-frases.jpg
galeria-promos.jpg
```

Después se ajusta `src/styles.css` para usar esas imágenes como fondo de las tarjetas o se modifica `App.jsx` para mostrarlas como imágenes reales.

## Criterio de textos

Mantener el tono:

- Cálido.
- Familiar.
- Cristiano sin sonar forzado.
- Simple.
- Cercano.
- Visualmente cuidado.

Evitar:

- Textos genéricos tipo tienda masiva.
- Prometer stock fijo si no está confirmado.
- Publicar precios si cambian seguido.
- Agregar carrito o pagos en esta primera etapa.

## Próximo paso recomendado

Cargar WhatsApp real y reemplazar los bloques visuales por fotos propias. Eso va a hacer que la web deje de sentirse como maqueta y pase a sentirse marca.