// frontend/components/WhatsAppButton.jsx
import { WhatsAppIcon } from './PaymentIcons'

export default function WhatsAppButton({ shirt }) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO
  const mensagem = encodeURIComponent(
    `Olá! Tenho interesse na camisa *${shirt.name}* (ref: #${shirt.id}) por R$ ${shirt.price.toFixed(2)}`
  )

  return (
    <a
      className="btn-whatsapp"
      href={`https://wa.me/${numero}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
      }}
    >
      <WhatsAppIcon />
      Comprar pelo WhatsApp
    </a>
  )
}