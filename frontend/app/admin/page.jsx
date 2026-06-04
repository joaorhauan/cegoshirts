'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import { removeToken } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import './admin.css'

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState([])

  useEffect(() => {
    api.get('/clicks').then(({ data }) => setData(data))
  }, [])

  const handleSignOut = () => {
    removeToken()
    router.push('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav className="admin-nav">
        <Link href="/" className="admin-titulo">Cego Shirts</Link>
        <div className="admin-acoes">
          <Link href="/admin/new" className="btn-primario">+ Nova camisa</Link>
          <button className="btn-secundario" onClick={handleSignOut}>Sair</button>
        </div>
      </nav>

      <div className="admin-conteudo">
        <table className="tabela">
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
                    width={40}
                    height={40}
                    className="tabela-thumb"
                  />
                  {shirt.name}
                </td>
                <td>
                  <span className={shirt.status === 'soldout' ? 'status-esgotado' : shirt.status === 'unlisted' ? 'status-unlisted' : 'status-disponivel'}>
                        {shirt.status === 'soldout' ? 'Esgotada' : shirt.status === 'unlisted' ? 'Em breve' : 'Disponível'}
                  </span>
                </td>
                <td>{shirt.totalClicks}</td>
                <td>
                  <Link href={`/admin/${shirt.id}/edit`} className="btn-secundario">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#a0a0a0', padding: 40 }}>
                  Nenhuma camisa cadastrada ainda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}