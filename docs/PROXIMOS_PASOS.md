# Próximos pasos - ANAVIM showroom

Este documento deja anotado qué conviene hacer después, sin romper la primera versión ya publicada.

## Prioridad 1 - Panel administrador privado

La próxima mejora importante es convertir el showroom en un sitio administrable.

Documento técnico-funcional:

```txt
docs/PANEL_ADMIN.md
```

Objetivo:

- Acceso privado en `/admin`.
- Alta, edición y baja lógica de productos.
- Gestión de precios.
- Gestión de promociones.
- Gestión de stock.
- Productos destacados.
- Consulta por WhatsApp con nombre y código del producto.

Criterio recomendado:

```txt
Cloudflare Pages + Pages Functions + Cloudflare D1
```

No conviene resolver esto con JSON local porque el navegador no puede guardar cambios en archivos del repo de forma segura.

## Prioridad 2 - Productos y promos

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

## Prioridad 3 - Contador privado de visitas

El contador no debe mostrarse en la web pública.

Opciones a evaluar:

1. Usar analítica privada del panel de Cloudflare, si alcanza para ver visitas, páginas y origen básico.
2. Agregar una herramienta gratuita de analítica liviana y privada, sólo si Cloudflare no alcanza.
3. Evitar contadores públicos, widgets visibles o servicios que carguen publicidad.

Criterio recomendado: primero revisar lo disponible en Cloudflare. Si sirve, no agregar dependencias externas.

## Prioridad 4 - Dominio propio

La web puede seguir gratis en Cloudflare Pages con:

```txt
https://anavim-librosycafe.pages.dev
```

Más adelante, si conviene para marca, se puede comprar un dominio propio y conectarlo a Cloudflare.

## Prioridad 5 - SEO local

Cuando haya datos definitivos, completar:

- Dirección o zona de entrega.
- Horarios de atención.
- Medios de pago disponibles.
- Modalidad de retiro/envío.

No conviene inventar nada hasta que esté confirmado.

## Criterio

Primero showroom claro, lindo y rápido. Después panel administrador. Después contador privado. Después automatización. El carrito puede esperar sentado con un café.
