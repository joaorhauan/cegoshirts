'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api-client'
import { saveToken } from '@/lib/auth'
import '../admin.css'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password: password })
      saveToken(data.token)
      router.push('/admin')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-titulo">Cego Shirts</h1>

        <div className="form-grupo">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cegoshirts.com"
          />
        </div>

        <div className="form-grupo">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="erro">{error}</p>}

        <button
          className="btn-primario"
          style={{ width: '100%', height: 44, marginTop: 8 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}