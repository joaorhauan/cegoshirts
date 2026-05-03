'use client'
import { useState } from 'react'
import Link from 'next/link'
import ShirtCard from './ShirtCard'

export default function Vitrine({ shirts }) {
  const [filter, setFilter] = useState('all')

  const filtered = shirts.filter((shirt) => {
    if (filter === 'available') return !shirt.soldout
    if (filter === 'soldout') return shirt.soldout
    return true
  })

  return (
    <>
      <nav className="nav">
        <span className="nav-logo">Cego Shirts</span>
        <div className="nav-links">
          <a href="#colecao">Coleção</a>
          <a href="#contato">Contato</a>
        </div>
      </nav>

      <div className="hero">
        <p className="hero-subtitulo">Nova coleção</p>
        <h1 className="hero-titulo">Peças únicas, direto ao ponto.</h1>
      </div>

      <div className="filtros">
        <button
          className={`filtro ${filter === 'all' ? 'ativo' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button
          className={`filtro ${filter === 'available' ? 'ativo' : ''}`}
          onClick={() => setFilter('available')}
        >
          Disponíveis
        </button>
        <button
          className={`filtro ${filter === 'soldout' ? 'ativo' : ''}`}
          onClick={() => setFilter('soldout')}
        >
          Esgotadas
        </button>
      </div>

      <div className="grade" id="colecao">
        {filtered.map((shirt) => (
          <ShirtCard key={shirt.id} shirt={shirt} />
        ))}
        {filtered.length === 0 && (
          <p style={{ padding: 40, color: '#a0a0a0', gridColumn: '1/-1', textAlign: 'center' }}>
            Nenhuma camisa encontrada
          </p>
        )}
      </div>

      <div id="contato" style={{ borderTop: '0.5px solid #e8e8e8', padding: '48px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
          Dúvidas? Fale diretamente comigo WhatsApp.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{ display: 'inline-flex' }}
        >
          Falar no WhatsApp
        </a>
      </div>

      <footer className="footer">© 2026 Cego Shirts · Natal, RN </footer>
    </>
  )
}