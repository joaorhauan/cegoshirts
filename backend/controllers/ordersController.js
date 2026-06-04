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

    const msg = encodeURIComponent(`Novo pedido! Camisa: ${shirt.name} - ${name} - ${phone}`)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${msg}&apikey=${process.env.CALLMEBOT_API_KEY}`
    
    const response = await fetch(url)
    const text = await response.text()

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}