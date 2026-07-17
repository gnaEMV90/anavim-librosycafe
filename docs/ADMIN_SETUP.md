# Configuración del panel administrador

Este documento deja los pasos para activar el catálogo administrable de ANAVIM.

## Qué agrega esta etapa

- Ruta privada `/admin` para gestionar productos.
- API pública `/api/products` para mostrar productos activos en la web.
- API privada `/api/admin/products` para crear, editar y eliminar productos.
- Base de datos D1 para guardar productos.
- Botón público `Consultar` por producto, con mensaje automático a WhatsApp incluyendo nombre y código.

## Variables y bindings necesarios en Cloudflare Pages

En Cloudflare Pages > proyecto `anavim-librosycafe` > Settings:

### 1. Variable de entorno

```txt
ADMIN_TOKEN=<clave privada elegida por ANAVIM>
```

Esta clave se usa para entrar al panel `/admin`. No debe guardarse en el código.

### 2. Binding D1

Crear o vincular una base D1 con este binding:

```txt
Variable name: PRODUCTS_DB
Database: anavimproducts_db
```

La API espera exactamente el nombre `PRODUCTS_DB`.

## Crear o actualizar base D1

La migración inicial está en:

```txt
migrations/0001_products.sql
```

Si la tabla `products` ya existe, aplicar también esta migración nueva:

```txt
migrations/0002_add_card_price.sql
```

SQL para ejecutar una sola vez en la consola D1:

```sql
ALTER TABLE products ADD COLUMN card_price INTEGER;
```

## Acceso al panel

Una vez configurados `ADMIN_TOKEN` y `PRODUCTS_DB`, entrar a:

```txt
https://anavim-librosycafe.pages.dev/admin
```

Desde ahí se puede cargar:

- Código.
- Nombre.
- Categoría.
- Descripción.
- Precio.
- Precio promocional.
- Precio tarjeta / MercadoLibre.
- Stock.
- Ruta de imagen.
- Visibilidad en la web.
- Destacado.
- Orden.

## Imágenes de productos

Por ahora las imágenes se suben al repo, dentro de:

```txt
public/images/productos/
```

Y se cargan en el admin como ruta pública, por ejemplo:

```txt
/images/productos/biblia-infantil-01.png
```

Más adelante, si se quiere subir imágenes directamente desde el panel, conviene evaluar Cloudflare R2 u otra solución similar.

## Criterio de seguridad

Este panel no muestra la clave en la web pública. El navegador sólo envía la clave contra las APIs privadas. Cloudflare valida contra la variable `ADMIN_TOKEN` configurada en el servidor.

Para una etapa futura, se podría mejorar con sesiones firmadas, usuarios múltiples o Cloudflare Access.
