// frontend/app/shirt/[id]/page.jsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from '@/components/WhatsAppButton'
import PixModal from '@/components/PixModal'
import '../../detail.css'
import '../../vitrine.css'

export default function DetailsShirt({ params }) {
  const [shirt, setShirt] = useState(null)
  const [showPix, setShowPix] = useState(false)

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
                <button
                  className="btn-whatsapp"
                  style={{ background: '#0a0a0a', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPix(true)}
                >
                  Pagar via Pix
                </button>
                <WhatsAppButton shirt={shirt} />
              </div>
            </>
          )}
        </div>
      </div>

      {showPix && <PixModal shirt={shirt} onClose={() => setShowPix(false)} />}
    </>
  )
}