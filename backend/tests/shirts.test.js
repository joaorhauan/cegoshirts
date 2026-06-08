// backend/tests/shirts.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFindUnique = vi.fn()
const mockFindMany = vi.fn()

vi.mock('../lib/prisma.js', () => ({
  getPrisma: () => ({
    shirt: {
      findMany: mockFindMany,
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

describe('shirtsController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listShirts', () => {
    it('deve retornar lista de camisas', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 1, name: 'Essencial Preto', price: 89.90, status: 'available' }
      ])

      const { listShirts } = await import('../controllers/shirtsController.js')
      const req = {}
      const res = mockRes()

      await listShirts(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Essencial Preto' })
        ])
      )
    })
  })

  describe('getShirt', () => {
    it('deve retornar uma camisa pelo id', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 1, name: 'Essencial Preto', price: 89.90, status: 'available',
      })

      const { getShirt } = await import('../controllers/shirtsController.js')
      const req = { params: { id: '1' } }
      const res = mockRes()

      await getShirt(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'Essencial Preto' })
      )
    })

    it('deve retornar 404 se camisa não existe', async () => {
      mockFindUnique.mockResolvedValueOnce(null)

      const { getShirt } = await import('../controllers/shirtsController.js')
      const req = { params: { id: '999' } }
      const res = mockRes()

      await getShirt(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
})