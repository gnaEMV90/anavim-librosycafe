function enhanceNavigation() {
  const nav = document.querySelector('.main-nav')
  const instagramSection = document.querySelector('.curated-instagram-section')
  const expectsInstagramSection = window.location.pathname === '/' || window.location.pathname === ''

  if (instagramSection && instagramSection.id !== 'redes') {
    instagramSection.id = 'redes'
  }

  if (!nav) return false

  const existingRedesLinks = Array.from(nav.querySelectorAll('a')).filter(
    (link) => link.textContent.trim().toLowerCase() === 'redes' || link.getAttribute('href') === '/#redes',
  )
  const redesLink = existingRedesLinks[0] || document.createElement('a')

  existingRedesLinks.slice(1).forEach((link) => link.remove())

  redesLink.href = '/#redes'
  redesLink.textContent = 'Redes'

  const contactLink = Array.from(nav.querySelectorAll('a')).find(
    (link) => link.textContent.trim().toLowerCase() === 'contacto',
  )

  if (contactLink && redesLink.nextElementSibling !== contactLink) {
    nav.insertBefore(redesLink, contactLink)
  } else if (!contactLink && !redesLink.parentElement) {
    nav.appendChild(redesLink)
  }

  return !expectsInstagramSection || Boolean(document.querySelector('#redes'))
}

function watchNavigation() {
  if (enhanceNavigation()) return

  const observer = new MutationObserver(() => {
    if (enhanceNavigation()) {
      observer.disconnect()
    }
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
  window.setTimeout(() => observer.disconnect(), 5000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', watchNavigation, { once: true })
} else {
  watchNavigation()
}
