// frontend/lib/CartContext.jsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getSessionId } from './cart'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    const sessionId = getSessionId()
    if (!sessionId) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${sessionId}`)
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
  }

  const addToCart = async (shirtId) => {
    setLoading(true)
    const sessionId = getSessionId()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, shirtId }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    await fetchCart()
    setLoading(false)
    return data
  }

  const removeFromCart = async (cartItemId) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item/${cartItemId}`, {
      method: 'DELETE',
    })
    await fetchCart()
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <CartContext.Provider value={{ items, total, loading, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)