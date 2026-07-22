function normalizeNavText(link) {
  return link.textContent.trim().toLowerCase()
}

function getNavKey(link) {
  const text = normalizeNavText(link)
  const href = link.getAttribute('href') || ''

  if (text === 'inicio' || href === '/') return 'inicio'
  if (text === 'cómo comprar' || text === 'como comprar' || href.includes('como-comprar')) return 'como-comprar'
  if (text === 'catálogo' || text === 'catalogo' || href.includes('catalogo')) return 'catalogo'
  if (text === 'nosotros' || href.includes('nosotros')) return 'nosotros'
  if (text === 'redes' || href.includes('redes')) return 'redes'
  if (text === 'contacto' || href.includes('contacto')) return 'contacto'

  return text
}

function placeRedesLink() {
  const nav = document.querySelector('.main-nav')
  const instagramSection = document.querySelector('.curated-instagram-section')

  if (instagramSection && instagramSection.id !== 'redes') {
    instagramSection.id = 'redes'
  }

  if (!nav) return false

  const linksByKey = new Map()
  const unknownLinks = []

  Array.from(nav.querySelectorAll('a')).forEach((link) => {
    const key = getNavKey(link)

    if (key === 'redes') {
      link.remove()
      return
    }

    if (['inicio', 'como-comprar', 'catalogo', 'nosotros', 'contacto'].includes(key)) {
      linksByKey.set(key, link)
      return
    }

    unknownLinks.push(link)
  })

  const redesLink = document.createElement('a')
  redesLink.href = '/#redes'
  redesLink.textContent = 'Redes'

  const orderedLinks = [
    linksByKey.get('inicio'),
    linksByKey.get('como-comprar'),
    linksByKey.get('catalogo'),
    linksByKey.get('nosotros'),
    redesLink,
    linksByKey.get('contacto'),
    ...unknownLinks,
  ].filter(Boolean)

  orderedLinks.forEach((link) => nav.appendChild(link))

  return true
}

function enhanceNavigation() {
  placeRedesLink()

  let attempts = 0
  const interval = window.setInterval(() => {
    attempts += 1
    placeRedesLink()

    if (attempts >= 40) {
      window.clearInterval(interval)
    }
  }, 150)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceNavigation, { once: true })
} else {
  enhanceNavigation()
}
