// frontend/lib/cart.js
import { v4 as uuidv4 } from 'uuid'

export const getSessionId = () => {
  if (typeof window === 'undefined') return null
  let id = localStorage.getItem('cartSessionId')
  if (!id) {
    id = uuidv4()
    localStorage.setItem('cartSessionId', id)
  }
  return id
}