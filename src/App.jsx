import { useEffect, useState } from 'react'
import AdminApp from './Admin'
import { siteContent } from './data/siteContent'
import './featuredImages.css'
import './showroomExtras.css'
import './brandPolish.css'
import './products.css'

const hasWhatsapp = Boolean(siteContent.contact.whatsappNumber?.trim())
const whatsappHref = hasWhatsapp
  ? `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encodeURIComponent(
      siteContent.contact.whatsappMessage,
    )}`
  : siteContent.contact.instagramUrl
const contactLabel = hasWhatsapp
  ? siteContent.hero.primaryCta || 'Consultar por WhatsApp'
  : 'Consultar por Instagram'
const contactButtonLabel = hasWhatsapp ? 'Abrir WhatsApp' : 'Abrir Instagram'

function formatPrice(value) {
  const amount = Number(value || 0)

  if (!amount) return 'Consultar precio'

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getProductWhatsappHref(product) {
  if (!hasWhatsapp) return siteContent.contact.instagramUrl

  const messageLines = [
    'Hola ANAVIM, quiero consultar por este producto:',
    product.title,
    product.code ? `Código: ${product.code}` : '',
    product.price ? `Precio: ${formatPrice(product.price)}` : '',
    product.cardPrice ? `Precio tarjeta: ${formatPrice(product.cardPrice)}` : '',
  ].filter(Boolean)

  return `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encodeURIComponent(
    messageLines.join('\n'),
  )}`
}

function trackProductConsult(product) {
  fetch('/api/consults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      productCode: product.code,
      productTitle: product.title,
    }),
    keepalive: true,
  }).catch(() => {})
}

function Header({ currentPage = 'home' }) {
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="Ir al inicio">
        <img src="/logo-anavim.svg" alt="ANAVIM - Libros y Café" />
        <span>
          <strong>{siteContent.brand.name}</strong>
          <small>{siteContent.brand.subtitle}</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="Navegación principal">
        <a href="/" aria-current={currentPage === 'home' ? 'page' : undefined}>Inicio</a>
        <a href="/catalogo" aria-current={currentPage === 'catalog' ? 'page' : undefined}>Catálogo</a>
        <a href="/#como-comprar">Cómo comprar</a>
        <a href="/#nosotros">Nosotros</a>
        <a href="/#contacto">Contacto</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">{siteContent.hero.eyebrow}</p>
        <h1>{siteContent.hero.title}</h1>
        <p className="hero-text">{siteContent.hero.text}</p>

        <div className="hero-tags" aria-label="Características de ANAVIM">
          {siteContent.hero.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="hero-actions">
          <a className="btn btn-primary" href="/catalogo">
            Ver catálogo
          </a>
          <a className="btn btn-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
            {contactLabel}
          </a>
        </div>
      </div>

      <div className="hero-card" aria-label="Identidad visual de ANAVIM">
        <img src="/logo-anavim.svg" alt="Logo ANAVIM" />
        <div className="hero-card-note">
          <span>Libros</span>
          <span>Café</span>
          <span>Regalos</span>
        </div>
      </div>
    </section>
  )
}

function ValueSection() {
  return (
    <section className="section section-intro" aria-labelledby="propuesta-title">
      <div className="section-heading">
        <p className="eyebrow">Nuestra propuesta</p>
        <h2 id="propuesta-title">{siteContent.brand.tagline}</h2>
        <p>{siteContent.brand.description}</p>
      </div>

      <div className="value-grid">
        {siteContent.valueCards.map((item) => (
          <article className="value-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function FeaturedSection() {
  return (
    <section className="section featured-section" id="libros" aria-labelledby="destacados-title">
      <div className="section-heading compact">
        <p className="eyebrow">Showroom</p>
        <h2 id="destacados-title">Productos destacados</h2>
      </div>

      <div className="featured-grid">
        {siteContent.featured.map((item) => (
          <article className="featured-card" key={item.title}>
            {item.imageSrc ? (
              <img
                className="featured-card-image"
                src={item.imageSrc}
                alt={item.imageAlt}
                loading="lazy"
              />
            ) : (
              <div className="featured-card-placeholder" aria-hidden="true">
                <span>Próximamente</span>
              </div>
            )}
            <span>{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`${item.cta} por WhatsApp`}>
              {item.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function CatalogTeaserSection() {
  return (
    <section className="section catalog-teaser-section" aria-labelledby="catalogo-home-title">
      <div className="catalog-teaser-panel">
        <div>
          <p className="eyebrow">Catálogo ANAVIM</p>
          <h2 id="catalogo-home-title">Todo el catálogo en una página aparte.</h2>
          <p>
            Para que la portada quede liviana, el catálogo completo ahora tiene su propio espacio con buscador,
            filtros, precios, stock y consulta directa por WhatsApp.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/catalogo">
              Ver catálogo completo
            </a>
            <a className="btn btn-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <div className="catalog-teaser-grid" aria-label="Resumen del catálogo">
          <article>
            <span>01</span>
            <h3>Buscador</h3>
            <p>Encontrá rápido por nombre, código, categoría o descripción.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Precios claros</h3>
            <p>Precio normal, promo y precio tarjeta cuando corresponda.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Consulta directa</h3>
            <p>El botón Consultar abre WhatsApp con el producto ya armado.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  const hasPromo = Boolean(product.promoPrice && product.promoPrice < product.price)
  const hasCardPrice = Boolean(product.cardPrice)
  const productHref = getProductWhatsappHref(product)

  return (
    <article className="product-card" key={product.id || product.code}>
      {product.imageSrc ? (
        <img className="product-image" src={product.imageSrc} alt={product.title} loading="lazy" />
      ) : (
        <div className="product-image product-image-placeholder" aria-hidden="true">
          <span>{product.category || 'ANAVIM'}</span>
        </div>
      )}

      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          {product.code ? <small>{product.code}</small> : null}
        </div>

        <h3>{product.title}</h3>
        <p>{product.description}</p>

        <div className="product-price-stack">
          <div className="product-price-row">
            {hasPromo ? (
              <>
                <span>Precio</span>
                <strong>{formatPrice(product.promoPrice)}</strong>
                <small>{formatPrice(product.price)}</small>
              </>
            ) : (
              <>
                <span>Precio</span>
                <strong>{formatPrice(product.price)}</strong>
              </>
            )}
          </div>

          {hasCardPrice ? (
            <div className="product-card-price-row">
              <span>Precio tarjeta</span>
              <strong>{formatPrice(product.cardPrice)}</strong>
            </div>
          ) : null}
        </div>

        <div className="product-footer-row">
          <span className={product.stock > 0 ? 'stock-pill available' : 'stock-pill unavailable'}>
            {product.stock > 0 ? 'Disponible' : 'Consultar stock'}
          </span>
          <a
            href={productHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackProductConsult(product)}
          >
            Consultar
          </a>
        </div>
      </div>
    </article>
  )
}

function ProductCatalogSection({ standalone = false }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  useEffect(() => {
    let isMounted = true

    fetch('/api/products')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el catálogo')
        return response.json()
      })
      .then((data) => {
        if (!isMounted) return
        setProducts(Array.isArray(data.products) ? data.products : [])
        setStatus('ready')
      })
      .catch(() => {
        if (!isMounted) return
        setProducts([])
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return standalone ? (
      <section className="section product-section product-section-standalone" aria-live="polite">
        <p className="product-empty">Cargando catálogo...</p>
      </section>
    ) : null
  }

  if (status === 'error') {
    return standalone ? (
      <section className="section product-section product-section-standalone" aria-live="polite">
        <p className="product-empty">No se pudo cargar el catálogo. Probá nuevamente en unos minutos.</p>
      </section>
    ) : null
  }

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, 'es'))
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter
    const searchableText = [product.title, product.code, product.category, product.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })

  return (
    <section
      className={`section product-section ${standalone ? 'product-section-standalone' : ''}`}
      id="catalogo"
      aria-label={standalone ? 'Catálogo de productos' : undefined}
      aria-labelledby={!standalone ? 'catalogo-title' : undefined}
    >
      {!standalone ? (
        <div className="section-heading compact">
          <p className="eyebrow">{siteContent.catalog.eyebrow}</p>
          <h2 id="catalogo-title">{siteContent.catalog.title}</h2>
          <p>{siteContent.catalog.text}</p>
        </div>
      ) : null}

      {products.length ? (
        <>
          <div className="product-toolbar" aria-label="Filtros del catálogo">
            <label>
              Buscar
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Libro, Biblia, café..."
              />
            </label>
            <label>
              Categoría
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="Todas">Todas</option>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <span>
              {filteredProducts.length} de {products.length} productos
            </span>
          </div>

          {filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard product={product} key={product.id || product.code} />
              ))}
            </div>
          ) : (
            <p className="product-empty">No encontramos productos con ese filtro. Probá otra categoría o búsqueda.</p>
          )}
        </>
      ) : (
        <p className="product-empty">Todavía no hay productos visibles en el catálogo.</p>
      )}
    </section>
  )
}

function CategoriesSection() {
  return (
    <section className="category-strip" id="cafe" aria-label="Categorías disponibles">
      {siteContent.categories.map((category) => (
        <span key={category}>{category}</span>
      ))}
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="section process-section" id="como-comprar" aria-labelledby="como-comprar-title">
      <div className="section-heading compact">
        <p className="eyebrow">Cómo comprar</p>
        <h2 id="como-comprar-title">Simple, directo y sin carrito por ahora.</h2>
      </div>

      <div className="process-grid">
        {siteContent.process.map((item, index) => (
          <article className="process-card" key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function GallerySection() {
  return (
    <section className="section gallery-section" aria-labelledby="galeria-title">
      <div className="section-heading compact">
        <p className="eyebrow">Inspirado en Instagram</p>
        <h2 id="galeria-title">Un vistazo a ANAVIM</h2>
      </div>

      <div className="gallery-grid">
        {siteContent.gallery.map((item, index) => (
          <article className={`gallery-card gallery-card-${index + 1}`} key={item.title}>
            <div>
              <span className="gallery-number">0{index + 1}</span>
              {item.tag ? <small className="gallery-tag">{item.tag}</small> : null}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  const paragraphs = siteContent.about.paragraphs || [siteContent.about.text]
  const highlights = siteContent.about.highlights || []

  return (
    <section className="section about-section" id="nosotros" aria-labelledby="nosotros-title">
      <div className="about-layout">
        <div className="about-panel">
          <p className="eyebrow">Sobre ANAVIM</p>
          <h2 id="nosotros-title">{siteContent.about.title}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {highlights.length ? (
          <div className="about-highlight-grid" aria-label="Resumen de la historia de ANAVIM">
            {highlights.map((item) => (
              <article className="about-highlight-card" key={item.title}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section final-cta-section" aria-labelledby="final-cta-title">
      <div className="final-cta-panel">
        <p className="eyebrow">Consultas</p>
        <h2 id="final-cta-title">{siteContent.finalCta.title}</h2>
        <p>{siteContent.finalCta.text}</p>
        <div className="hero-actions final-cta-actions">
          <a className="btn btn-primary" href="/catalogo">
            Ver catálogo
          </a>
          <a className="btn btn-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
            {contactButtonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="section contact-section" id="contacto" aria-labelledby="contacto-title">
      <div>
        <p className="eyebrow">Contacto</p>
        <h2 id="contacto-title">¿Buscás un libro, café o una promo para regalar?</h2>
        <p>{siteContent.contact.note}</p>
      </div>

      <div className="contact-card">
        <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
          {contactButtonLabel}
        </a>
        <a href={siteContent.contact.instagramUrl} target="_blank" rel="noreferrer">
          @{siteContent.brand.instagramUser}
        </a>
        <span>{siteContent.contact.location}</span>
        {siteContent.contact.email ? <span>{siteContent.contact.email}</span> : null}
        {!hasWhatsapp ? <small>WhatsApp pendiente de configurar.</small> : null}
      </div>
    </section>
  )
}

function FloatingWhatsapp() {
  if (!hasWhatsapp) return null

  return (
    <a
      className="floating-whatsapp"
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp con ANAVIM"
    >
      Consultar por WhatsApp
    </a>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <strong>ANAVIM - Libros y Café</strong>
      <span>{siteContent.brand.tagline}</span>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Header currentPage="home" />
      <main>
        <Hero />
        <ValueSection />
        <FeaturedSection />
        <CatalogTeaserSection />
        <CategoriesSection />
        <ProcessSection />
        <GallerySection />
        <AboutSection />
        <FinalCtaSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  )
}

function CatalogPage() {
  return (
    <>
      <Header currentPage="catalog" />
      <main className="catalog-page-main">
        <section className="catalog-page-hero" aria-labelledby="catalog-page-title">
          <div>
            <p className="eyebrow">Catálogo completo</p>
            <h1 id="catalog-page-title">Libros, café y regalos disponibles.</h1>
            <p>
              Explorá los productos cargados por ANAVIM, filtrá por categoría y consultá directo por WhatsApp
              con nombre, código y precio del producto.
            </p>
          </div>
          <div className="catalog-page-note">
            <strong>Showroom sin carrito</strong>
            <span>Consultás disponibilidad y coordinamos compra, retiro o envío por mensaje.</span>
          </div>
        </section>

        <ProductCatalogSection standalone />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  )
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'

  useEffect(() => {
    if (pathname.startsWith('/catalogo')) {
      document.title = 'Catálogo | ANAVIM - Libros y Café'
      return
    }

    if (pathname.startsWith('/admin')) {
      document.title = 'Admin | ANAVIM - Libros y Café'
      return
    }

    document.title = 'ANAVIM - Libros y Café'
  }, [pathname])

  if (pathname.startsWith('/admin')) return <AdminApp />
  if (pathname.startsWith('/catalogo')) return <CatalogPage />

  return <HomePage />
}
