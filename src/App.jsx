import { siteContent } from './data/siteContent'

const whatsappHref = `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encodeURIComponent(
  siteContent.contact.whatsappMessage,
)}`

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

        <div className="hero-actions">
          <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            Consultar por WhatsApp
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
            <span>{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
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
              <span>0{index + 1}</span>
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
  return (
    <section className="section about-section" id="nosotros" aria-labelledby="nosotros-title">
      <div className="about-panel">
        <p className="eyebrow">Sobre ANAVIM</p>
        <h2 id="nosotros-title">{siteContent.about.title}</h2>
        <p>{siteContent.about.text}</p>
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
        <p>
          Escribinos y te contamos qué hay disponible. La web funciona como showroom: la atención y
          coordinación se hacen directo por WhatsApp o Instagram.
        </p>
      </div>

      <div className="contact-card">
        <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
          Abrir WhatsApp
        </a>
        <a href={siteContent.contact.instagramUrl} target="_blank" rel="noreferrer">
          @{siteContent.brand.instagramUser}
        </a>
        <span>{siteContent.contact.location}</span>
        <span>{siteContent.contact.email}</span>
      </div>
    </section>
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
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
