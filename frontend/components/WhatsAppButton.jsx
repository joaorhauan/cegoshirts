

export default function WhatsAppButton({ shirt }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = encodeURIComponent(
    `Olá! Tenho interesse na camisa *${shirt.name}* (ref: #${shirt.id}) por R$ ${shirt.price.toFixed(2)}`
  )
  const link = `https://wa.me/${number}?text=${message}`

  return (
  <a
    
      className="btn-whatsapp"
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Comprar pelo WhatsApp
    </a>
  )
}