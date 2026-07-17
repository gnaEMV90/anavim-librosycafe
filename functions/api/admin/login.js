function unauthorized(message = 'Clave incorrecta') {
  return Response.json({ error: message }, { status: 401 })
}

export async function onRequestPost(context) {
  const expectedToken = context.env.ADMIN_TOKEN

  if (!expectedToken) {
    return Response.json(
      { error: 'ADMIN_TOKEN no está configurado en Cloudflare Pages.' },
      { status: 500 },
    )
  }

  const body = await context.request.json().catch(() => ({}))
  const token = String(body.token || '').trim()

  if (!token || token !== expectedToken) {
    return unauthorized()
  }

  return Response.json({ ok: true })
}
