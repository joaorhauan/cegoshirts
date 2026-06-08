// backend/controllers/ordersController.js
import { getPrisma } from '../lib/prisma.js'
import { notifyOrder } from '../lib/notify.js'

export const createOrder = async (req, res) => {
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

    // marca todas como esgotadas
    for (const shirt of shirts) {
      await prisma.shirt.update({
        where: { id: shirt.id },
        data: { status: 'soldout', reservedUntil: null },
      })
    }

    // remove do carrinho
    await prisma.cartItem.deleteMany({
      where: { shirtId: { in: shirtIds } },
    })

    const totalPrice = shirts.reduce((sum, s) => sum + s.price, 0)
    const shirtNames = shirts.map((s) => s.name).join(', ')

    await notifyOrder({
      shirtName: shirtNames,
      shirtId: String(shirtId),
      price: totalPrice,
      name,
      email,
      phone,
    })

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}