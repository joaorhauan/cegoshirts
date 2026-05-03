import Link from 'next/link'
import Image from 'next/image'

export default function ClicksTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Camisa</th>
          <th>Status</th>
          <th>Cliques</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((shirt) => (
          <tr key={shirt.id}>
            <td>
              <Image
                src={shirt.imageUrl}
                alt={shirt.name}
                width={48}
                height={48}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
              {shirt.name}
            </td>
            <td>{shirt.soldout ? 'Esgotada' : 'Disponível'}</td>
            <td>{shirt.totalClicks}</td>
            <td>
              <Link href={`/admin/${shirt.id}/edit`}>Editar</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}