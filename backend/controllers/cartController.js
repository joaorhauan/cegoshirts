// backend/controllers/cartController.js
import { getPrisma } from '../lib/prisma.js'

const RESERVATION_MINUTES = 15

// libera reservas expiradas automaticamente
export const releaseExpiredReservations = async () => {
  const prisma = getPrisma()
  const now = new Date()

  const expiredItems = await prisma.cartItem.findMany({
    where: {
      shirt: {
        reservedUntil: { lt: now },
        status: 'reserved',
      },
    },
    include: { shirt: true },
  })

  for (const item of expiredItems) {
    await prisma.shirt.update({
      where: { id: item.shirtId },
      data: { status: 'available', reservedUntil: null },
    })
    await prisma.cartItem.delete({ where: { id: item.id } })
  }

  // limpa carrinhos vazios
  await prisma.cart.deleteMany({
    where: { items: { none: {} } },
  })

  if (expiredItems.length > 0) {
    console.log(`${expiredItems.length} reserva(s) expirada(s) liberada(s)`)
  }
}

// pega ou cria carrinho
export const getCart = async (req, res) => {
  const prisma = getPrisma()
  const { sessionId } = req.params

  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { shirt: true },
        },
      },
    })

    if (!cart) return res.json({ items: [], total: 0 })

    // filtra itens com reserva expirada
    const now = new Date()
    const validItems = cart.items.filter(
      (item) => item.shirt.reservedUntil && item.shirt.reservedUntil > now
    )

    const total = validItems.reduce((sum, item) => sum + item.shirt.price, 0)

    res.json({
      id: cart.id,
      items: validItems.map((item) => ({
        cartItemId: item.id,
        id: item.shirt.id,
        name: item.shirt.name,
        price: item.shirt.price,
        imageUrl: item.shirt.imageUrl,
        size: item.shirt.size,
        babylook: item.shirt.babylook,
        reservedUntil: item.shirt.reservedUntil,
      })),
      total,
    })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// adiciona ao carrinho
export const addToCart = async (req, res) => {
  const prisma = getPrisma()
  const { sessionId, shirtId } = req.body

  try {
    const shirt = await prisma.shirt.findUnique({
      where: { id: Number(shirtId) },
    })

    if (!shirt) return res.status(404).json({ error: 'Shirt not found' })

    if (shirt.status !== 'available') {
      return res.status(400).json({ error: 'Shirt not available' })
    }

    const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000)

    // reserva a camisa
    await prisma.shirt.update({
      where: { id: Number(shirtId) },
      data: { status: 'reserved', reservedUntil },
    })

    // pega ou cria carrinho
    const cart = await prisma.cart.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId },
    })

    // adiciona item
    await prisma.cartItem.create({
      data: { cartId: cart.id, shirtId: Number(shirtId) },
    })

    res.status(201).json({ ok: true, reservedUntil })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// remove do carrinho
export const removeFromCart = async (req, res) => {
  const prisma = getPrisma()
  const { cartItemId } = req.params

  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: Number(cartItemId) },
      include: { shirt: true },
    })

    if (!item) return res.status(404).json({ error: 'Item not found' })

    // libera a camisa
    await prisma.shirt.update({
      where: { id: item.shirtId },
      data: { status: 'available', reservedUntil: null },
    })

    await prisma.cartItem.deleteMany({ where: { id: Number(cartItemId) } })

    res.json({ ok: true })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}