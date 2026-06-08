// frontend/app/checkout/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PixModal from '@/components/PixModal'
import CardModal from '@/components/CardModal'
import { CardIcons, PixIcon, WhatsAppIcon } from '@/components/PaymentIcons'
import '../vitrine.css'
import '../admin/admin.css'

export default function Checkout() {
  const { items, total, removeFromCart } = useCart()
  const router = useRouter()
  const [showPix, setShowPix] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  // timer baseado na reserva mais antiga
  useEffect(() => {
    if (items.length === 0) return

    const earliest = items.reduce((min, item) =>
      new Date(item.reservedUntil) < new Date(min.reservedUntil) ? item : min
    )

    const interval = setInterval(() => {
      const diff = new Date(earliest.reservedUntil) - new Date()
      if (diff <= 0) {
        setTimeLeft('00:00')
        clearInterval(interval)
        router.refresh()
      } else {
        const mins = Math.floor(diff / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [items])

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 14, color: '#a0a0a0' }}>Seu carrinho está vazio</p>
        <Link href="/" className="btn-primario" style={{ padding: '10px 24px' }}>Ver camisas</Link>
      </div>
    )
  }

  // objeto "virtual" para os modais de pagamento
  const cartAsShirt = {
    id: items.map(i => i.id).join('-'),
    name: items.length === 1 ? items[0].name : `${items.length} camisas`,
    price: total,
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">Cego Shirts</Link>
        <Link href="/" className="nav-back">← Continuar comprando</Link>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Carrinho</h1>

        {timeLeft && (
          <div style={{
            background: '#fff8e1', border: '0.5px solid #ffe082',
            borderRadius: 6, padding: '10px 16px',
            fontSize: 13, color: '#633806', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            ⏱️ Suas peças estão reservadas por <strong>{timeLeft}</strong> — finalize a compra antes que o tempo acabe.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#e8e8e8', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
          {items.map((item) => (
            <div key={item.cartItemId} style={{
              background: '#fff', padding: '16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <Image src={item.imageUrl} alt={item.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: '#a0a0a0' }}>{item.babylook ? `Babylook ${item.size}` : item.size}</p>
                <p style={{ fontSize: 14, color: '#555', marginTop: 4 }}>R$ {item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.cartItemId)}
                style={{ fontSize: 18, color: '#a0a0a0', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, fontSize: 15, fontWeight: 500 }}>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setShowCard(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, height: 48, background: '#0a0a0a', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            <CardIcons />
            Pagar com Cartão
          </button>
          <p style={{ fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: -4 }}>em até 12x</p>

          <button
            onClick={() => setShowPix(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, height: 48, background: '#1a1a1a', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            <PixIcon />
            Pagar via Pix
          </button>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}?text=${encodeURIComponent(
              `Olá! Tenho interesse nas seguintes camisas:\n\n${items.map(i => `• ${i.name} (ref: #${i.id}) — R$ ${i.price.toFixed(2)}`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, height: 48, background: '#fff',
              border: '0.5px solid #e0e0e0', borderRadius: 6, fontSize: 13,
              fontWeight: 500, cursor: 'pointer', color: '#0a0a0a',
              textDecoration: 'none',
            }}
          >
            <WhatsAppIcon />
            Comprar pelo WhatsApp
          </a>
        </div>
      </div>

      {showPix && <PixModal shirt={cartAsShirt} onClose={() => setShowPix(false)} />}
      {showCard && <CardModal shirt={cartAsShirt} onClose={() => setShowCard(false)} />}
    </>
  )
}