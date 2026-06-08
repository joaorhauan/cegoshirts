// backend/controllers/checkoutController.js
import { getPrisma } from '../lib/prisma.js'

export const createCheckout = async (req, res) => {
  const prisma = getPrisma()
  const { shirtId, name, email, phone } = req.body

  try {
    // suporta múltiplos ids separados por -
    const shirtIds = String(shirtId).split('-').map(Number)

    const shirts = await Promise.all(
      shirtIds.map((id) => prisma.shirt.findUnique({ where: { id } }))
    )

    const notFound = shirts.some((s) => !s)
    if (notFound) return res.status(404).json({ error: 'Shirt not found' })

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: process.env.INFINITYPAY_HANDLE,
        redirect_url: `${process.env.FRONTEND_URL}/obrigado`,
        order_nsu: String(shirtId),
        payer: { name, email, phone },
        items: shirts.map((s) => ({
          description: s.name,
          quantity: 1,
          price: Math.round(s.price * 100),
        })),
      }),
    })

    const data = await response.json()

    if (!data.url) {
      return res.status(500).json({ error: 'Erro ao gerar link de pagamento' })
    }

    res.json({ url: data.url })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}