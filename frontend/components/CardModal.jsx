// frontend/components/CardModal.jsx
'use client'
import { useState } from 'react'
import { useCart } from '@/lib/CartContext'

export default function CardModal({ shirt, onClose }) {
  const { items } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // se vier do carrinho usa todos os ids, senão usa o id da camisa individual
  const shirtId = items.length > 0
    ? items.map((i) => i.id).join('-')
    : shirt.id

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      setError('Preencha todos os campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shirtId, name, email, phone }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        onClose()
      } else {
        setError('Erro ao gerar link de pagamento')
      }
    } catch {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', height: 44, border: '0.5px solid #e0e0e0',
    borderRadius: 6, paddingInline: 14, fontSize: 14,
    color: '#0a0a0a', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 500, letterSpacing: '.08em',
    textTransform: 'uppercase', color: '#555',
    display: 'block', marginBottom: 6,
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 12, padding: 32,
          width: '100%', maxWidth: 400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
          Pagar com Cartão
        </h2>
        <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 24 }}>
          {shirt.name} — R$ {shirt.price.toFixed(2)}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Telefone</label>
            <input style={inputStyle} type="tel" placeholder="(84) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#c00', marginTop: 12 }}>{error}</p>
        )}

        <button
          style={{
            width: '100%', height: 44, background: '#0a0a0a',
            color: '#fff', borderRadius: 6, fontSize: 14,
            fontWeight: 500, border: 'none', cursor: 'pointer',
            marginTop: 20, opacity: loading ? 0.6 : 1,
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Gerando link...' : 'Ir para pagamento'}
        </button>

        <button
          style={{
            width: '100%', height: 44, background: 'transparent',
            color: '#a0a0a0', border: 'none', cursor: 'pointer',
            fontSize: 13, marginTop: 8,
          }}
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}