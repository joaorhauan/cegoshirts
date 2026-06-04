// backend/lib/notify.js
export const notifyOrder = async ({ shirtName, shirtId, price, name, email, phone }) => {
  const msg = encodeURIComponent(
    `🛍️ Novo pedido!\n\n` +
    `Camisa: ${shirtName} (#${shirtId})\n` +
    `Valor: R$ ${price.toFixed(2)}\n\n` +
    `👤 Comprador:\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n` +
    `Telefone: ${phone}`
  )

  const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${msg}&apikey=${process.env.CALLMEBOT_API_KEY}`

  await fetch(url)
}