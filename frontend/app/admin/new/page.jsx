
import FormShirt from '@/components/admin/FormShirt'
import Link from 'next/link'
import '../admin.css'

export default function NewShirt() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav className="admin-nav">
        <Link href="/admin" className="admin-titulo">Cego Shirts</Link>
        <span style={{ fontSize: 13, color: '#a0a0a0' }}>Nova camisa</span>
        <div style={{ width: 80 }} />
      </nav>

      <div className="admin-conteudo" style={{ maxWidth: 560 }}>
        <FormShirt />
      </div>
    </div>
  )
}