// backend/tests/auth.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'

const mockFindUnique = vi.fn()

vi.mock('../lib/prisma.js', () => ({
  getPrisma: () => ({
    admin: {
      findUnique: mockFindUnique,
    }
  })
}))

const mockRes = () => {
  const res = {}
  res.json = vi.fn().mockReturnValue(res)
  res.status = vi.fn().mockReturnValue(res)
  return res
}

describe('authController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test_secret'
  })

  it('deve retornar 401 se admin não existe', async () => {
    mockFindUnique.mockResolvedValueOnce(null)

    const { login } = await import('../controllers/authController.js')
    const req = { body: { email: 'fake@test.com', password: '123' } }
    const res = mockRes()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('deve retornar 401 se senha incorreta', async () => {
    const hash = await bcrypt.hash('senhaCorreta', 10)
    mockFindUnique.mockResolvedValueOnce({
      id: 1, email: 'admin@test.com', password: hash,
    })

    const { login } = await import('../controllers/authController.js')
    const req = { body: { email: 'admin@test.com', password: 'senhaErrada' } }
    const res = mockRes()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('deve retornar token se credenciais corretas', async () => {
    const hash = await bcrypt.hash('senhaCorreta', 10)
    mockFindUnique.mockResolvedValueOnce({
      id: 1, email: 'admin@test.com', password: hash,
    })

    const { login } = await import('../controllers/authController.js')
    const req = { body: { email: 'admin@test.com', password: 'senhaCorreta' } }
    const res = mockRes()

    await login(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    )
  })
})