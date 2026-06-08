// frontend/components/CartButton.jsx
'use client'
import { useCart } from '@/lib/CartContext'
import { useRouter } from 'next/navigation'

export default function CartButton() {
  const { items } = useCart()
  const router = useRouter()

  if (items.length === 0) return null

  return (
    <button
      onClick={() => router.push('/checkout')}
      style={{
        position: 'fixed', bottom: 24, right: 24,
        background: '#0a0a0a', color: '#fff',
        border: 'none', borderRadius: 999,
        padding: '12px 20px', fontSize: 13,
        fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 50, transition: 'transform .2s',
      }}
    >
      🛍️ Carrinho ({items.length}) · R$ {items.reduce((s, i) => s + i.price, 0).toFixed(2)}
    </button>
  )
}