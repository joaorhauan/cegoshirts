
import Link from 'next/link'
import Image from 'next/image'

export default function ShirtCard({ shirt }) {
  return (
    <Link href={`/shirt/${shirt.id}`}>
      <div className={`card ${shirt.status === 'soldout' ? 'esgotada' : ''}`}>
        <div className="card-img">
          <Image
            src={shirt.imageUrl}
            alt={shirt.name}
            width={400}
            height={400}
          />
          <span className="badge-size">
            {shirt.babylook ? `BBYL ${shirt.size}` : shirt.size}
          </span>
          {shirt.status === 'soldout' && <span className="badge-esgotado">Esgotada</span>}
          {shirt.status === 'unlisted' && <span className="badge-unlisted">Em breve</span>}
        </div>
        <div className="card-info">
          <p className="card-nome">{shirt.name}</p>
          {shirt.line && <p className="card-linha">{shirt.line}</p>}
          {shirt.status === 'unlisted' ? (
            <p className="card-preco card-preco-unlisted">Em breve</p>
          ) : (
            <p className="card-preco">R$ {shirt.price.toFixed(2)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}