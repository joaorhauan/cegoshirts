import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
})

export async function notifyOrder(data) {
  const { shirtName, shirtId, price, name, email, phone } = data

  try {
    const info = await transporter.sendMail({
      from: `"App de Vendas" <${process.env.EMAIL_USER}>`, 
      
      // Aqui a mágica acontece: o Nodemailer pega a carta e joga direto 
      // no endereço do vendedor que vocês definiram no .env
      to: process.env.SELLER_EMAIL, 
      
      subject: `💰 Nova Venda Confirmada: ${shirtName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px;">
          <h2 style="color: #27ae60; margin-top: 0;">Nova venda confirmada! 🎉</h2>
          <p>O pagamento via InfinityPay foi aprovado.</p>
          <hr>
          <p><strong>Peça:</strong> ${shirtName} (ID: ${shirtId})</p>
          <p><strong>Valor:</strong> R$ ${price.toFixed(2)}</p>
          <hr>
          <p><strong>Comprador:</strong> ${name}</p>
          <p><strong>WhatsApp/Telefone:</strong> ${phone}</p>
        </div>
      `,
    })

    console.log('E-mail enviado com sucesso! ID:', info.messageId)
    return { success: true }

  } catch (err) {
    console.error('Erro ao enviar e-mail pelo Nodemailer:', err)
    return { success: false, error: err }
  }
}