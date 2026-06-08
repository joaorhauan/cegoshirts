// backend/routes/webhook.js
import { Router } from 'express'
import { getPrisma } from '../lib/prisma.js'
import { notifyOrder } from '../lib/notify.js'

const router = Router()

router.post('/infinitypay', async (req, res) => {
  const prisma = getPrisma()
  const { order_nsu, items, payer, paid_amount } = req.body

  console.log('WEBHOOK INFINITYPAY:', JSON.stringify(req.body, null, 2))

  try {
    const shirtIds = String(order_nsu).split('-').map(Number)

    const shirts = await Promise.all(
      shirtIds.map((id) => prisma.shirt.findUnique({ where: { id } }))
    )

    // marca todas as camisas como esgotadas e remove reserva
    for (const shirt of shirts) {
      if (!shirt) continue
      await prisma.shirt.update({
        where: { id: shirt.id },
        data: { status: 'soldout', reservedUntil: null },
      })
    }

    // remove itens do carrinho
    await prisma.cartItem.deleteMany({
      where: { shirtId: { in: shirtIds } },
    })

    // notifica o vendedor
    await notifyOrder({
      shirtName: shirts.map((s) => s?.name).join(', '),
      shirtId: order_nsu,
      price: (paid_amount || 0) / 100,
      name: payer?.name || '—',
      email: payer?.email || '—',
      phone: payer?.phone || '—',
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('WEBHOOK ERRO:', err)
    res.status(400).json({ error: 'Webhook error' })
  }
})

export default router