import api from '@/lib/api'
import WhatsAppButton from '@/components/WhatsAppButton'
import Image from 'next/image'
import Link from 'next/link'
import '../../detail.css'

export default async function DetailsShirt({ params }) {
  const { id } = await params
  const { data: shirt } = await api.get(`/shirts/${id}`)

  await api.post(`/clicks/${id}`)

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">Cego Shirts</Link>
        <Link href="/" className="nav-back">← Voltar</Link>
      </nav>

      <div className="detalhe">
        <div className="detalhe-img">
          <Image
            src={shirt.imageUrl}
            alt={shirt.name}
            width={600}
            height={600}
          />
        </div>
        <div className="detalhe-info">
          <h1 className="detalhe-nome">{shirt.name}</h1>
          <p className="detalhe-preco">R$ {shirt.price.toFixed(2)}</p>
          {shirt.description && (
            <p className="detalhe-descricao">{shirt.description}</p>
          )}
          {shirt.soldout ? (
            <span className="esgotado-aviso">Produto esgotado</span>
          ) : (
            <WhatsAppButton shirt={shirt} />
          )}
        </div>
      </div>
    </>
  )
}