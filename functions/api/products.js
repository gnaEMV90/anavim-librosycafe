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

export async function onRequestGet(context) {
  const db = context.env.PRODUCTS_DB

  if (!db) {
    return Response.json({ products: [] })
  }

  const { results } = await db
    .prepare(
      `SELECT *
       FROM products
       WHERE is_active = 1
       ORDER BY is_featured DESC, display_order ASC, id DESC`,
    )
    .all()

  return Response.json({ products: results.map(serializeProduct) })
}
