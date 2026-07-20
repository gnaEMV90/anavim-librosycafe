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

export async function onRequestPost(context) {
  const db = context.env.PRODUCTS_DB

  if (!db) {
    return Response.json({ ok: true, tracked: false })
  }

  try {
    await ensureConsultTable(db)

    const body = await context.request.json().catch(() => ({}))
    const productId = Number.parseInt(body.productId, 10) || null
    const productCode = String(body.productCode || '').trim().slice(0, 80)
    const productTitle = String(body.productTitle || '').trim().slice(0, 180)

    await db
      .prepare(
        `INSERT INTO consult_events
          (product_id, product_code, product_title, source)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(productId, productCode, productTitle, 'catalog')
      .run()

    return Response.json({ ok: true, tracked: true })
  } catch {
    return Response.json({ ok: true, tracked: false })
  }
}
