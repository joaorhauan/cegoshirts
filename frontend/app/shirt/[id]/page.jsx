'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from '@/components/WhatsAppButton'
import PixModal from '@/components/PixModal'
import CardModal from '@/components/CardModal'
import { CardIcons, PixIcon } from '@/components/PaymentIcons'
import CartButton from '@/components/CartButton'
import ReservedTimer from '@/components/ReservedTimer'
import '../../detail.css'
import '../../vitrine.css'

export default function DetailsShirt({ params }) {
  const [shirt, setShirt] = useState(null)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const [showPix, setShowPix] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const { addToCart, items } = useCart()

  const alreadyInCart = items.some((i) => i.id === shirt?.id)

  useEffect(() => {
    const load = async () => {
      const { id } = await params
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shirts/${id}`)
      const data = await res.json()
      setShirt(data)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clicks/${id}`, { method: 'POST' })
    }
    load()
  }, [])

  const handleAddToCart = async () => {
    try {
      setError('')
      await addToCart(shirt.id)
      setAdded(true)
    } catch {
      setError('Camisa indisponível no momento')
    }
  }

  if (!shirt) return null

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">Cego Shirts</Link>
        <div className="nav-links">
          <Link href="/" className="nav-back">← Voltar</Link>
          <Link href="/checkout" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            🛍️ Carrinho
            {items.length > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: '#0a0a0a', color: '#fff',
                fontSize: 10, fontWeight: 500,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className="detalhe">
        <div className="detalhe-img">
          <Image src={shirt.imageUrl} alt={shirt.name} width={600} height={600} />
        </div>
        <div className="detalhe-info">
          {shirt.line && <p className="detalhe-linha">{shirt.line}</p>}
          <h1 className="detalhe-nome">{shirt.name}</h1>

          <div className="detalhe-tags">
            <span className="detalhe-tag">{shirt.babylook ? `Babylook ${shirt.size}` : shirt.size}</span>
            <span className="detalhe-tag">{shirt.condition}</span>
            {shirt.year && <span className="detalhe-tag">{shirt.year}</span>}
          </div>

          {shirt.description && <p className="detalhe-descricao">{shirt.description}</p>}

          {shirt.status === 'unlisted' ? (
            <span className="esgotado-aviso">Em breve</span>
          ) : shirt.status === 'soldout' ? (
            <span className="esgotado-aviso">Produto esgotado</span>
          ) : shirt.status === 'reserved' ? (
            <ReservedTimer reservedUntil={shirt.reservedUntil} />
          ) : (
            <>
              <p className="detalhe-preco">R$ {shirt.price.toFixed(2)}</p>
              {error && <p style={{ fontSize: 13, color: '#c00' }}>{error}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* carrinho */}
                <button
                  style={{
                    height: 48, background: added || alreadyInCart ? '#1a7a3a' : '#0a0a0a',
                    color: '#fff', border: 'none', borderRadius: 6,
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                  onClick={handleAddToCart}
                  disabled={added || alreadyInCart}
                >
                  {added || alreadyInCart ? '✓ Adicionada ao carrinho' : '🛍️ Adicionar ao carrinho'}
                </button>

                <div style={{ height: '0.5px', background: '#e8e8e8', margin: '4px 0' }} />

                {/* cartão */}
                <button
                  onClick={() => setShowCard(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 10, height: 48, background: '#1a1a1a', color: '#fff',
                    border: 'none', borderRadius: 6, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  <CardIcons />
                  Comprar com Cartão
                </button>
                <p style={{ fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: -4 }}>em até 12x</p>

                {/* pix */}
                <button
                  onClick={() => setShowPix(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, height: 48, background: '#2a2a2a', color: '#fff',
                    border: 'none', borderRadius: 6, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  <PixIcon />
                  Comprar via Pix
                </button>

                {/* whatsapp */}
                <WhatsAppButton shirt={shirt} />
              </div>
            </>
          )}
        </div>
      </div>

      {showPix && <PixModal shirt={shirt} onClose={() => setShowPix(false)} />}
      {showCard && <CardModal shirt={shirt} onClose={() => setShowCard(false)} />}
      <CartButton />
    </>
  )
}