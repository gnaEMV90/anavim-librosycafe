const navItems = [
  { text: 'Inicio', href: '/' },
  { text: 'Cómo comprar', href: '/#como-comprar' },
  { text: 'Catálogo', href: '/catalogo' },
  { text: 'Nosotros', href: '/#nosotros' },
  { text: 'Redes', href: '/#redes' },
  { text: 'Contacto', href: '/#contacto' },
]

function setInstagramSectionId() {
  const instagramSection = document.querySelector('.curated-instagram-section')

  if (instagramSection) {
    instagramSection.id = 'redes'
  }
}

function isCurrentPage(href) {
  const pathname = window.location.pathname

  if (href === '/') return pathname === '/' || pathname === ''
  if (href === '/catalogo') return pathname.startsWith('/catalogo')

  return false
}

function buildLink(item) {
  const link = document.createElement('a')

  link.href = item.href
  link.textContent = item.text

  if (isCurrentPage(item.href)) {
    link.setAttribute('aria-current', 'page')
  }

  return link
}

function rebuildNavigation() {
  const nav = document.querySelector('.main-nav')

  setInstagramSectionId()

  if (!nav) return false

  nav.replaceChildren(...navItems.map(buildLink))
  return true
}

function enhanceNavigation() {
  rebuildNavigation()

  let attempts = 0
  const interval = window.setInterval(() => {
    attempts += 1
    rebuildNavigation()

    if (attempts >= 40) {
      window.clearInterval(interval)
    }
  }, 100)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceNavigation, { once: true })
} else {
  enhanceNavigation()
}
