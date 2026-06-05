
import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { notifyOrder } from '../lib/notify.js'

const router = Router()

router.post('/infinitypay', async (req, res) => {
  const { order_nsu, items, payer, capture_method, paid_amount } = req.body

  console.log('WEBHOOK INFINITYPAY:', JSON.stringify(req.body, null, 2))

  try {
    // pega o shirtId que salvamos no order_nsu
    const shirtId = parseInt(order_nsu)

    if (shirtId) {
      await prisma.shirt.update({
        where: { id: shirtId },
        data: { status: 'soldout' },
      })

      await notifyOrder({
        shirtName: items?.[0]?.description || 'Camisa',
        shirtId,
        price: (paid_amount || 0) / 100,
        name: payer?.name || '—',
        email: payer?.email || '—',
        phone: payer?.phone || '—',
      })
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('WEBHOOK ERRO:', err)
    res.status(400).json({ error: 'Webhook error' })
  }
})

export default router