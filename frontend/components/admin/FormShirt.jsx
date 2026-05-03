'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api-client.js'

export default function FormShirt({ shirt }) {
  const router = useRouter()
  const editing = !!shirt

  const [name, setName] = useState(shirt?.name || '')
  const [description, setDescription] = useState(shirt?.description || '')
  const [price, setPrice] = useState(shirt?.price || '')
  const [soldout, setSoldout] = useState(shirt?.soldout || false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(shirt?.imageUrl || null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('soldout', soldout)
    if (image) formData.append('image', image)

    try {
      if (editing) {
        await api.put(`/shirts/${shirt.id}`, formData)
      } else {
        await api.post('/shirts', formData)
      }
      router.push('/admin')
    } catch {
      setError('Erro ao salvar camisa')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar essa camisa?')) return
    await api.delete(`/shirts/${shirt.id}`)
    router.push('/admin')
  }

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 24 }}>
        <div style={{
          width: '100%', aspectRatio: '1/1',
          background: '#f5f5f5', borderRadius: 8,
          border: '0.5px solid #e8e8e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', cursor: 'pointer', position: 'relative',
        }}>
          {preview ? (
            <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized={preview.startsWith('blob')} />
          ) : (
            <span style={{ fontSize: 13, color: '#a0a0a0' }}>Clique para trocar a imagem</span>
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

      <label className="form-checkbox" style={{ marginBottom: 24 }}>
        <input
          type="checkbox"
          checked={soldout}
          onChange={(e) => setSoldout(e.target.checked)}
        />
        Marcar como esgotada
      </label>

      {error && <p className="erro">{error}</p>}

      <button
        className="btn-primario"
        style={{ width: '100%', height: 44 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar camisa'}
      </button>

      {editing && (
        <button
          className="btn-perigo"
          style={{ width: '100%', height: 44, marginTop: 12 }}
          onClick={handleDelete}
        >
          Deletar camisa
        </button>
      )}
    </div>
  )
}