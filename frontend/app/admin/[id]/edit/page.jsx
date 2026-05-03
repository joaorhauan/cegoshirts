import api from '@/lib/api'
import FormShirt from '@/components/admin/FormShirt'
import Link from 'next/link'
import '../../admin.css'

export default async function EditShirt({ params }) {
  const { id } = await params
  const { data: shirt } = await api.get(`/shirts/${id}`)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav className="admin-nav">
        <Link href="/admin" className="btn-secundario">← Voltar</Link>
        <span className="admin-titulo">Editar camisa</span>
        <div style={{ width: 80 }} />
      </nav>

      <div className="admin-conteudo" style={{ maxWidth: 560 }}>
        <FormShirt shirt={shirt} />
      </div>
    </div>
  )
}