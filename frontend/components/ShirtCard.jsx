import Link from 'next/link'
import Image from 'next/image'

export default function ShirtCard({ shirt }) {
  return (
    <Link href={`/shirt/${shirt.id}`}>
      <div className={`card ${shirt.soldout ? 'esgotada' : ''}`}>
        <div className="card-img">
          <Image
            src={shirt.imageUrl}
            alt={shirt.name}
            width={400}
            height={400}
          />
        </div>
        {shirt.soldout && <span className="badge-esgotado">Esgotada</span>}
        <div className="card-info">
          <p className="card-nome">{shirt.name}</p>
          <p className="card-preco">R$ {shirt.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}