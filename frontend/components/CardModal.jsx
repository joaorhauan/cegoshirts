
'use client'
import { useState } from 'react'

export default function CardModal({ shirt, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shirtId: shirt.id,
          name,
          email,
          phone,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
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