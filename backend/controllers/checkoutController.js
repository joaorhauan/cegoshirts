
export const createCheckout = async (req, res) => {
  const { shirtId, name, email, phone } = req.body

  try {
    const shirt = await prisma.shirt.findUnique({
      where: { id: Number(shirtId) },
    })

    if (!shirt) return res.status(404).json({ error: 'Shirt not found' })

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: process.env.INFINITYPAY_HANDLE,
        redirect_url: `${process.env.FRONTEND_URL}/obrigado`,
        order_nsu: String(shirt.id),
        payer: { name, email, phone },
        items: [
            {
            description: shirt.name,
            quantity: 1,
            price: Math.round(shirt.price * 100),
            },
        ],
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