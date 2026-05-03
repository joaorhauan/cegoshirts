
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import Link from 'next/link'
import '../admin.css'

export default function NovaCamisa() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!name || !price || !image) {
      setError('Nome, preço e imagem são obrigatórios')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('image', image)
      await api.post('/shirts', formData)
      router.push('/admin')
    } catch {
      setError('Erro ao cadastrar camisa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav className="admin-nav">
        <Link href="/admin" className="btn-secundario">← Voltar</Link>
        <span className="admin-titulo">Nova camisa</span>
        <div style={{ width: 80 }} />
      </nav>

      <div className="admin-conteudo" style={{ maxWidth: 560 }}>

        <label style={{ display: 'block', marginBottom: 24 }}>
          <div style={{
            width: '100%', aspectRatio: '1/1',
            background: '#f5f5f5', borderRadius: 8,
            border: '0.5px solid #e8e8e8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', cursor: 'pointer',
          }}>
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 13, color: '#a0a0a0' }}>Clique para adicionar imagem</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </label>

        <div className="form-grupo">
          <label className="form-label">Nome</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Essencial Preto"
          />
        </div>

        <div className="form-grupo">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div className="form-grupo">
          <label className="form-label">Preço</label>
          <input
            className="form-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="89.90"
            step="0.01"
          />
        </div>

        {error && <p className="erro">{error}</p>}

        <button
          className="btn-primario"
          style={{ width: '100%', height: 44, marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar camisa'}
        </button>

      </div>
    </div>
  )
}