// frontend/app/admin/page.jsx
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

  const load = async () => {
    const { data } = await api.get('/clicks')
    setData(data)
  }

  useEffect(() => { load() }, [])

  const handleSignOut = () => {
    removeToken()
    router.push('/admin/login')
  }

  const toggleStatus = async (shirt) => {
    const nextStatus = shirt.status === 'available' ? 'soldout' : 'available'
    await api.put(`/shirts/${shirt.id}`, { status: nextStatus })
    await load()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav className="admin-nav">
        <Link href="/" className="admin-titulo">Cego Shirts</Link>
        <div className="admin-acoes">
          <Link href="/admin/nova" className="btn-primario">+ Nova camisa</Link>
          <button className="btn-secundario" onClick={handleSignOut}>Sair</button>
        </div>
      </nav>

      <div className="admin-conteudo">

        {/* tabela — desktop */}
        <table className="tabela tabela-desktop">
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
                  <Image src={shirt.imageUrl} alt={shirt.name} width={40} height={40} className="tabela-thumb" />
                  {shirt.name}
                </td>
                <td>
                  <span className={
                    shirt.status === 'soldout' ? 'status-esgotado' :
                    shirt.status === 'unlisted' ? 'status-unlisted' :
                    'status-disponivel'
                  }>
                    {shirt.status === 'soldout' ? 'Esgotada' :
                     shirt.status === 'unlisted' ? 'Em breve' : 'Disponível'}
                  </span>
                </td>
                <td>{shirt.totalClicks}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link href={`/admin/${shirt.id}/edit`} className="btn-secundario">Editar</Link>
                    {shirt.status !== 'unlisted' && (
                      <button
                        className={shirt.status === 'available' ? 'btn-perigo' : 'btn-secundario'}
                        onClick={() => toggleStatus(shirt)}
                      >
                        {shirt.status === 'available' ? 'Esgotar' : 'Disponibilizar'}
                      </button>
                    )}
                  </div>
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

        {/* cards — mobile */}
        <div className="cards-mobile">
          {data.map((shirt) => (
            <div key={shirt.id} className="admin-card">
              <div className="admin-card-left">
                <Image src={shirt.imageUrl} alt={shirt.name} width={56} height={56} className="tabela-thumb" />
                <div>
                  <p className="admin-card-nome">{shirt.name}</p>
                  <p className="admin-card-cliques">{shirt.totalClicks} cliques</p>
                  <span className={
                    shirt.status === 'soldout' ? 'status-esgotado' :
                    shirt.status === 'unlisted' ? 'status-unlisted' :
                    'status-disponivel'
                  }>
                    {shirt.status === 'soldout' ? 'Esgotada' :
                     shirt.status === 'unlisted' ? 'Em breve' : 'Disponível'}
                  </span>
                </div>
              </div>
              <div className="admin-card-acoes">
                <Link href={`/admin/${shirt.id}/edit`} className="btn-secundario">Editar</Link>
                {shirt.status !== 'unlisted' && (
                  <button
                    className={shirt.status === 'available' ? 'btn-perigo' : 'btn-secundario'}
                    onClick={() => toggleStatus(shirt)}
                  >
                    {shirt.status === 'available' ? 'Esgotar' : 'Disponibilizar'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p style={{ textAlign: 'center', color: '#a0a0a0', padding: 40, fontSize: 14 }}>
              Nenhuma camisa cadastrada ainda
            </p>
          )}
        </div>

      </div>
    </div>
  )
}