import { siteContent } from './data/siteContent'
import './featuredImages.css'
import './showroomExtras.css'
import './brandPolish.css'

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

function Header() {
  return (
    <header className="site-header">
      <a className="brand-link" href="#inicio" aria-label="Ir al inicio">
        <img src="/logo-anavim.svg" alt="ANAVIM - Libros y Café" />
        <span>
          <strong>{siteContent.brand.name}</strong>
          <small>{siteContent.brand.subtitle}</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="Navegación principal">
        <a href="#libros">Libros</a>
        <a href="#cafe">Café</a>
        <a href="#como-comprar">Cómo comprar</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
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
          <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            {contactLabel}
          </a>
          <a
            className="btn btn-secondary"
            href={siteContent.contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            {siteContent.hero.secondaryCta || 'Ver Instagram'}
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
          <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            {contactButtonLabel}
          </a>
          <a
            className="btn btn-secondary"
            href={siteContent.contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver Instagram
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

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ValueSection />
        <FeaturedSection />
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
