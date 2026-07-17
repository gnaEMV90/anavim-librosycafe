function unauthorized() {
  return Response.json({ error: 'No autorizado' }, { status: 401 })
}

function getAuthToken(request) {
  return (request.headers.get('Authorization') || '').replace('Bearer ', '').trim()
}

function assertAdmin(context) {
  const expectedToken = context.env.ADMIN_TOKEN

  if (!expectedToken) {
    return Response.json(
      { error: 'ADMIN_TOKEN no está configurado en Cloudflare Pages.' },
      { status: 500 },
    )
  }

  if (getAuthToken(context.request) !== expectedToken) {
    return unauthorized()
  }

  return null
}

function assertDb(context) {
  if (!context.env.PRODUCTS_DB) {
    return Response.json(
      { error: 'PRODUCTS_DB no está configurada en Cloudflare Pages.' },
      { status: 500 },
    )
  }

  return null
}

function serializeProduct(row) {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    category: row.category,
    description: row.description,
    price: row.price,
    promoPrice: row.promo_price,
    stock: row.stock,
    imageSrc: row.image_src,
    isActive: Boolean(row.is_active),
    isFeatured: Boolean(row.is_featured),
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function normalizePayload(body) {
  return {
    code: String(body.code || '').trim().toUpperCase(),
    title: String(body.title || '').trim(),
    category: String(body.category || 'Libros').trim(),
    description: String(body.description || '').trim(),
    price: Number.parseInt(body.price || 0, 10) || 0,
    promoPrice: body.promoPrice === null || body.promoPrice === '' ? null : Number.parseInt(body.promoPrice, 10) || null,
    stock: Number.parseInt(body.stock || 0, 10) || 0,
    imageSrc: String(body.imageSrc || '').trim(),
    isActive: body.isActive ? 1 : 0,
    isFeatured: body.isFeatured ? 1 : 0,
    displayOrder: Number.parseInt(body.displayOrder || 0, 10) || 0,
  }
}

function validateProduct(product) {
  if (!product.code) return 'El código es obligatorio.'
  if (!product.title) return 'El nombre es obligatorio.'
  if (!product.category) return 'La categoría es obligatoria.'
  return null
}

export async function onRequestGet(context) {
  const authError = assertAdmin(context)
  if (authError) return authError

  const dbError = assertDb(context)
  if (dbError) return dbError

  const { results } = await context.env.PRODUCTS_DB
    .prepare('SELECT * FROM products ORDER BY is_active DESC, is_featured DESC, display_order ASC, id DESC')
    .all()

  return Response.json({ products: results.map(serializeProduct) })
}

export async function onRequestPost(context) {
  const authError = assertAdmin(context)
  if (authError) return authError

  const dbError = assertDb(context)
  if (dbError) return dbError

  const body = await context.request.json().catch(() => ({}))
  const product = normalizePayload(body)
  const validationError = validateProduct(product)

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 })
  }

  try {
    const result = await context.env.PRODUCTS_DB
      .prepare(
        `INSERT INTO products
          (code, title, category, description, price, promo_price, stock, image_src, is_active, is_featured, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        product.code,
        product.title,
        product.category,
        product.description,
        product.price,
        product.promoPrice,
        product.stock,
        product.imageSrc,
        product.isActive,
        product.isFeatured,
        product.displayOrder,
      )
      .run()

    const id = result.meta?.last_row_id
    const created = id
      ? await context.env.PRODUCTS_DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
      : await context.env.PRODUCTS_DB.prepare('SELECT * FROM products WHERE code = ?').bind(product.code).first()

    return Response.json({ product: serializeProduct(created) }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'No se pudo crear el producto. Revisá que el código no esté repetido.' },
      { status: 400 },
    )
  }
}
