// backend/controllers/ordersController.js
import prisma from '../lib/prisma.js'
import { notifyOrder } from '../lib/notify.js'

export const createOrder = async (req, res) => {
  const { shirtId, name, email, phone } = req.body

  try {
    const shirt = await prisma.shirt.findUnique({
      where: { id: Number(shirtId) },
    })

    if (!shirt) return res.status(404).json({ error: 'Shirt not found' })

    // 1. Marca a camisa como esgotada no banco
    await prisma.shirt.update({
      where: { id: Number(shirtId) },
      data: { status: 'soldout' },
    })

    // 2. Dispara a notificação por e-mail (Nodemailer)
    // Coloquei o aviso de "PIX Manual" para o vendedor saber que precisa checar o extrato
    await notifyOrder({
      shirtName: `${shirt.name} (PIX Manual - Conferir Conta)`,
      shirtId: shirt.id,
      price: Number(shirt.price),
      name: name || 'Não informado',
      email: email || 'Não informado',
      phone: phone || 'Não informado',
    })

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('ERRO NA CRIAÇÃO DA ORDER:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}