(() => {
  const instagramUrl = 'https://www.instagram.com/anavim.librosycafe/'

  document.addEventListener('click', (event) => {
    const card = event.target.closest?.('.gallery-card')
    if (!card) return

    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    const card = event.target.closest?.('.gallery-card')
    if (!card) return

    event.preventDefault()
    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
  })

  const enhanceGalleryCards = () => {
    document.querySelectorAll('.gallery-card').forEach((card) => {
      card.setAttribute('role', 'link')
      card.setAttribute('tabindex', '0')
      card.setAttribute('aria-label', 'Ver ANAVIM en Instagram')
    })
  }

  const observer = new MutationObserver(enhanceGalleryCards)
  observer.observe(document.documentElement, { childList: true, subtree: true })
  enhanceGalleryCards()
})()
