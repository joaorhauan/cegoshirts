'use client'
import { useState, useEffect } from 'react'
import { CardIcons, PixIcon } from '@/components/PaymentIcons'
import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from '@/components/WhatsAppButton'
import PixModal from '@/components/PixModal'
import CardModal from '@/components/CardModal'
import '../../detail.css'
import '../../vitrine.css'

export default function DetailsShirt({ params }) {
  const [shirt, setShirt] = useState(null)
  const [showPix, setShowPix] = useState(false)
  const [showCard, setShowCard] = useState(false)

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

  if (!shirt) return null

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">Cego Shirts</Link>
        <Link href="/" className="nav-back">← Voltar</Link>
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
          ) : (
            <>
              <p className="detalhe-preco">R$ {shirt.price.toFixed(2)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

  {/* cartão */}
                <button
                  onClick={() => setShowCard(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 10, height: 48, background: '#0a0a0a', color: '#fff',
                    border: 'none', borderRadius: 6, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer', width: '100%',
                  }}
                >
                  <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <CardIcons />
                  </span>
                  Pagar com Cartão
                </button>
                <p style={{ fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: -4 }}>
                  em até 12x
                </p>

                {/* pix */}
                <button
                  onClick={() => setShowPix(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, height: 48, background: '#1a1a1a', color: '#fff',
                    border: 'none', borderRadius: 6, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer', width: '100%',
                  }}
                >
                  <PixIcon />
                  Pagar via Pix
                </button>

                <WhatsAppButton shirt={shirt} />
              </div>
            </>
          )}
        </div>
      </div>

      {showPix && <PixModal shirt={shirt} onClose={() => setShowPix(false)} />}
      {showCard && <CardModal shirt={shirt} onClose={() => setShowCard(false)} />}
    </>
  )
}