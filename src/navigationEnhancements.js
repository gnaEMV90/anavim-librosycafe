function placeRedesLink() {
  const nav = document.querySelector('.main-nav')
  const instagramSection = document.querySelector('.curated-instagram-section')

  if (instagramSection && instagramSection.id !== 'redes') {
    instagramSection.id = 'redes'
  }

  if (!nav) return false

  const links = Array.from(nav.querySelectorAll('a'))
  const contactLink = links.find((link) => link.textContent.trim().toLowerCase() === 'contacto')

  nav.querySelectorAll('a').forEach((link) => {
    const text = link.textContent.trim().toLowerCase()
    const href = link.getAttribute('href')

    if (text === 'redes' || href === '/#redes' || href === '#redes') {
      link.remove()
    }
  })

  const redesLink = document.createElement('a')
  redesLink.href = '/#redes'
  redesLink.textContent = 'Redes'

  if (contactLink && contactLink.parentElement === nav) {
    nav.insertBefore(redesLink, contactLink)
  } else {
    nav.appendChild(redesLink)
  }

  return true
}

function enhanceNavigation() {
  placeRedesLink()

  let attempts = 0
  const interval = window.setInterval(() => {
    attempts += 1
    placeRedesLink()

    if (attempts >= 20) {
      window.clearInterval(interval)
    }
  }, 150)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceNavigation, { once: true })
} else {
  enhanceNavigation()
}
