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

async function ensureConsultTable(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS consult_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        product_code TEXT,
        product_title TEXT,
        source TEXT NOT NULL DEFAULT 'catalog',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    )
    .run()

  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_consult_events_created_at ON consult_events (created_at)')
    .run()

  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_consult_events_product_code ON consult_events (product_code)')
    .run()
}

function numberValue(row, key) {
  return Number(row?.[key] || 0)
}

export async function onRequestGet(context) {
  const authError = assertAdmin(context)
  if (authError) return authError

  const dbError = assertDb(context)
  if (dbError) return dbError

  const db = context.env.PRODUCTS_DB
  await ensureConsultTable(db)

  const [productsRow, consultsRow, topProducts] = await Promise.all([
    db
      .prepare(
        `SELECT
          COUNT(*) AS total_products,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS visible_products,
          SUM(CASE WHEN stock <= 0 THEN 1 ELSE 0 END) AS out_of_stock_products
         FROM products`,
      )
      .first(),
    db
      .prepare(
        `SELECT
          COUNT(*) AS total_consults,
          SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) AS today_consults
         FROM consult_events`,
      )
      .first(),
    db
      .prepare(
        `SELECT
          COALESCE(product_code, '') AS product_code,
          COALESCE(product_title, '') AS product_title,
          COUNT(*) AS total
         FROM consult_events
         GROUP BY product_code, product_title
         ORDER BY total DESC, product_title ASC
         LIMIT 5`,
      )
      .all(),
  ])

  return Response.json({
    stats: {
      totalProducts: numberValue(productsRow, 'total_products'),
      visibleProducts: numberValue(productsRow, 'visible_products'),
      outOfStockProducts: numberValue(productsRow, 'out_of_stock_products'),
      totalConsults: numberValue(consultsRow, 'total_consults'),
      todayConsults: numberValue(consultsRow, 'today_consults'),
      topProducts: (topProducts.results || []).map((row) => ({
        productCode: row.product_code,
        productTitle: row.product_title,
        total: Number(row.total || 0),
      })),
    },
  })
}
