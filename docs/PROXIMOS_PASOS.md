# Próximos pasos - ANAVIM showroom

Este documento deja anotado qué conviene hacer después, sin romper la primera versión ya publicada.

## Prioridad 1 - Productos y promos

Crear una sección real de productos cuando estén listas las fotos.

Carpeta preparada:

```txt
public/images/productos/
```

Nombres recomendados:

```txt
combo-libro-cafe-01.png
biblia-infantil-01.png
cafe-grano-01.png
senaladores-01.png
promo-regalo-01.png
```

Criterio: nombres cortos, sin espacios, sin tildes y con guiones.

## Prioridad 2 - Catálogo simple

Si empieza a haber más de 6 o 9 productos, conviene pasar a un archivo editable:

```txt
src/data/products.js
```

Cada producto podría tener:

```js
{
  title: 'Combo libro + café',
  category: 'Combos',
  description: 'Detalle breve del producto.',
  imageSrc: '/images/productos/combo-libro-cafe-01.png',
  cta: 'Consultar disponibilidad'
}
```

## Prioridad 3 - Dominio propio

La web puede seguir gratis en Cloudflare Pages con:

```txt
https://anavim-librosycafe.pages.dev
```

Más adelante, si conviene para marca, se puede comprar un dominio propio y conectarlo a Cloudflare.

## Prioridad 4 - SEO local

Cuando haya datos definitivos, completar:

- Dirección o zona de entrega.
- Horarios de atención.
- Medios de pago disponibles.
- Modalidad de retiro/envío.

No conviene inventar nada hasta que esté confirmado.

## Criterio

Primero showroom claro, lindo y rápido. Después catálogo. Después automatización. El carrito puede esperar sentado con un café.
