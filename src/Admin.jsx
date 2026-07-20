import { useEffect, useMemo, useState } from 'react'
import './admin.css'

const TOKEN_KEY = 'anavimAdminToken'

const emptyProduct = {
  code: '',
  title: '',
  category: 'Libros',
  description: '',
  price: '',
  promoPrice: '',
  cardPrice: '',
  stock: '0',
  imageSrc: '',
  isActive: true,
  isFeatured: false,
  displayOrder: '0',
}

const emptyStats = {
  totalConsults: 0,
  todayConsults: 0,
  totalProducts: 0,
  visibleProducts: 0,
  outOfStockProducts: 0,
  topProducts: [],
}

function normalizeProductForForm(product) {
  return {
    code: product.code || '',
    title: product.title || '',
    category: product.category || 'Libros',
    description: product.description || '',
    price: product.price || '',
    promoPrice: product.promoPrice || '',
    cardPrice: product.cardPrice || '',
    stock: String(product.stock ?? 0),
    imageSrc: product.imageSrc || '',
    isActive: Boolean(product.isActive),
    isFeatured: Boolean(product.isFeatured),
    displayOrder: String(product.displayOrder ?? 0),
  }
}

function formatPrice(value) {
  const amount = Number(value || 0)

  if (!amount) return 'Sin precio'

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCsvCell(value) {
  const text = String(value ?? '').replace(/"/g, '""')
  return `"${text}"`
}

function downloadProductsCsv(products) {
  const headers = [
    'codigo',
    'nombre',
    'categoria',
    'descripcion',
    'precio',
    'precio_promo',
    'precio_tarjeta',
    'stock',
    'imagen',
    'visible',
    'destacado',
    'orden',
  ]
  const rows = products.map((product) => [
    product.code,
    product.title,
    product.category,
    product.description,
    product.price,
    product.promoPrice || '',
    product.cardPrice || '',
    product.stock,
    product.imageSrc,
    product.isActive ? 'SI' : 'NO',
    product.isFeatured ? 'SI' : 'NO',
    product.displayOrder,
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map(formatCsvCell).join(','))
    .join('\n')
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `anavim-productos-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 300)
}

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [loginToken, setLoginToken] = useState('')
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [statsStatus, setStatsStatus] = useState('idle')
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token],
  )

  async function adminFetch(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
      }

      throw new Error(data.error || 'Ocurrió un error en el panel administrador')
    }

    return data
  }

  async function loadProducts() {
    if (!token) return

    setStatus('loading')
    setMessage('')

    try {
      const data = await adminFetch('/api/admin/products')
      setProducts(Array.isArray(data.products) ? data.products : [])
      setStatus('ready')
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  async function loadStats() {
    if (!token) return

    setStatsStatus('loading')

    try {
      const data = await adminFetch('/api/admin/stats')
      setStats({ ...emptyStats, ...(data.stats || {}) })
      setStatsStatus('ready')
    } catch {
      setStats(emptyStats)
      setStatsStatus('error')
    }
  }

  useEffect(() => {
    if (!token) return
    loadProducts()
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: loginToken.trim() }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) throw new Error(data.error || 'Clave incorrecta')

      localStorage.setItem(TOKEN_KEY, loginToken.trim())
      setToken(loginToken.trim())
      setLoginToken('')
      setMessage('Ingreso correcto.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setProducts([])
    setStats(emptyStats)
    setForm(emptyProduct)
    setEditingId(null)
    setMessage('Sesión cerrada.')
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function editProduct(product) {
    setEditingId(product.id)
    setForm(normalizeProductForForm(product))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm({ notify = false } = {}) {
    setEditingId(null)
    setForm(emptyProduct)
    if (notify) setMessage('Formulario limpio.')
  }

  function handleExportProducts() {
    if (!products.length) {
      setStatus('error')
      setMessage('No hay productos para exportar.')
      return
    }

    downloadProductsCsv(products)
    setStatus('ready')
    setMessage('Exportación CSV generada.')
  }

  async function refreshAll() {
    await Promise.all([loadProducts(), loadStats()])
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('saving')
    setMessage('')

    const payload = {
      ...form,
      code: form.code.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      imageSrc: form.imageSrc.trim(),
      price: Number(form.price || 0),
      promoPrice: form.promoPrice === '' ? null : Number(form.promoPrice),
      cardPrice: form.cardPrice === '' ? null : Number(form.cardPrice),
      stock: Number(form.stock || 0),
      displayOrder: Number(form.displayOrder || 0),
    }

    if (payload.cardPrice && payload.price && payload.cardPrice < payload.price) {
      const confirmed = window.confirm(
        'El precio tarjeta quedó menor al precio normal. ¿Querés guardarlo igual?',
      )
      if (!confirmed) {
        setStatus('ready')
        return
      }
    }

    try {
      if (editingId) {
        await adminFetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setMessage(`Producto actualizado correctamente: ${payload.title}.`)
      } else {
        await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage(`Producto creado correctamente: ${payload.title}.`)
      }

      resetForm()
      await refreshAll()
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(`¿Eliminar el producto ${product.title}?`)
    if (!confirmed) return

    setStatus('saving')
    setMessage('')

    try {
      await adminFetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      setMessage('Producto eliminado.')
      await refreshAll()
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  if (!token) {
    return (
      <main className="admin-shell admin-login-shell">
        <section className="admin-login-card">
          <img src="/logo-anavim.svg" alt="ANAVIM - Libros y Café" />
          <p className="admin-eyebrow">Panel privado</p>
          <h1>Administrador ANAVIM</h1>
          <p>Ingresá con la clave privada configurada en Cloudflare para administrar productos.</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <label>
              Clave de administrador
              <input
                type="password"
                value={loginToken}
                onChange={(event) => setLoginToken(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit">Ingresar</button>
          </form>

          {message ? <p className="admin-message error">{message}</p> : null}
          <a href="/">Volver a la web</a>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Panel privado</p>
          <h1>Productos ANAVIM</h1>
          <p>Alta, edición, precios, promociones, stock, consultas y visibilidad del catálogo.</p>
        </div>
        <div className="admin-header-actions">
          <a href="/#catalogo" target="_blank" rel="noreferrer">Ver catálogo</a>
          <button type="button" onClick={handleExportProducts}>Exportar CSV</button>
          <button type="button" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      {message ? <p className={`admin-message ${status === 'error' ? 'error' : 'success'}`}>{message}</p> : null}

      <section className="admin-stats-grid" aria-label="Resumen del panel administrador">
        <article>
          <span>Consultas totales</span>
          <strong>{stats.totalConsults}</strong>
        </article>
        <article>
          <span>Consultas hoy</span>
          <strong>{stats.todayConsults}</strong>
        </article>
        <article>
          <span>Productos visibles</span>
          <strong>{stats.visibleProducts}</strong>
          <small>{stats.totalProducts} cargados</small>
        </article>
        <article>
          <span>Sin stock</span>
          <strong>{stats.outOfStockProducts}</strong>
        </article>
      </section>

      <section className="admin-top-panel">
        <div>
          <p className="admin-eyebrow">Interés del catálogo</p>
          <h2>Productos más consultados</h2>
        </div>
        {stats.topProducts?.length ? (
          <ol>
            {stats.topProducts.map((item) => (
              <li key={`${item.productCode}-${item.productTitle}`}>
                <span>{item.productTitle || item.productCode || 'Producto sin identificar'}</span>
                <strong>{item.total} consultas</strong>
              </li>
            ))}
          </ol>
        ) : (
          <p>{statsStatus === 'loading' ? 'Cargando métricas...' : 'Todavía no hay consultas registradas.'}</p>
        )}
      </section>

      <section className="admin-grid-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-title">
            <p className="admin-eyebrow">{editingId ? 'Editar producto' : 'Nuevo producto'}</p>
            <h2>{editingId ? form.title || 'Producto seleccionado' : 'Cargar producto'}</h2>
          </div>

          <div className="admin-field-row two-columns">
            <label>
              Código
              <input
                value={form.code}
                onChange={(event) => updateField('code', event.target.value)}
                placeholder="BIB-001"
                required
              />
            </label>
            <label>
              Categoría
              <input
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                placeholder="Libros"
                required
              />
            </label>
          </div>

          <label>
            Nombre
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Biblia infantil ilustrada"
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Descripción breve para mostrar en la web."
              rows="4"
            />
          </label>

          <div className="admin-field-row four-columns">
            <label>
              Precio
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => updateField('price', event.target.value)}
                placeholder="12000"
              />
            </label>
            <label>
              Precio promo
              <input
                type="number"
                min="0"
                value={form.promoPrice}
                onChange={(event) => updateField('promoPrice', event.target.value)}
                placeholder="Opcional"
              />
            </label>
            <label>
              Precio tarjeta
              <input
                type="number"
                min="0"
                value={form.cardPrice}
                onChange={(event) => updateField('cardPrice', event.target.value)}
                placeholder="Tarjeta"
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => updateField('stock', event.target.value)}
              />
            </label>
          </div>

          <label>
            Ruta de imagen
            <input
              value={form.imageSrc}
              onChange={(event) => updateField('imageSrc', event.target.value)}
              placeholder="/images/productos/biblia-infantil-01.png"
            />
          </label>

          {form.imageSrc ? (
            <div className="admin-image-preview">
              <img src={form.imageSrc} alt="Vista previa del producto" />
              <small>Vista previa desde la ruta cargada. Si no aparece, revisá nombre y ubicación del archivo.</small>
            </div>
          ) : (
            <p className="admin-image-help">Podés dejar la imagen vacía y cargarla más adelante.</p>
          )}

          <div className="admin-field-row two-columns">
            <label>
              Orden
              <input
                type="number"
                value={form.displayOrder}
                onChange={(event) => updateField('displayOrder', event.target.value)}
              />
            </label>
            <div className="admin-checks">
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => updateField('isActive', event.target.checked)}
                />
                Visible en la web
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField('isFeatured', event.target.checked)}
                />
                Destacado
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" disabled={status === 'saving'}>
              {editingId ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button type="button" className="secondary" onClick={() => resetForm({ notify: true })}>
              Limpiar formulario
            </button>
          </div>
        </form>

        <section className="admin-list-panel">
          <div className="admin-list-header">
            <div>
              <p className="admin-eyebrow">Catálogo</p>
              <h2>{products.length} productos</h2>
            </div>
            <button type="button" onClick={refreshAll}>Actualizar</button>
          </div>

          <div className="admin-product-list">
            {products.length ? (
              products.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  <div>
                    <span>{product.code}</span>
                    <h3>{product.title}</h3>
                    <p>{product.category} · {product.stock > 0 ? `${product.stock} en stock` : 'sin stock'}</p>
                    <div className="admin-price-summary">
                      <strong>
                        {product.promoPrice ? `${formatPrice(product.promoPrice)} promo` : formatPrice(product.price)}
                      </strong>
                      {product.cardPrice ? <small>Tarjeta: {formatPrice(product.cardPrice)}</small> : null}
                    </div>
                  </div>
                  <div className="admin-product-actions">
                    <small className={product.isActive ? 'visible' : 'hidden'}>
                      {product.isActive ? 'Visible' : 'Oculto'}
                    </small>
                    <a href="/#catalogo" target="_blank" rel="noreferrer">Ver web</a>
                    <button type="button" onClick={() => editProduct(product)}>Editar</button>
                    <button type="button" className="danger" onClick={() => deleteProduct(product)}>Eliminar</button>
                  </div>
                </article>
              ))
            ) : (
              <p className="admin-empty">Todavía no hay productos cargados.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
