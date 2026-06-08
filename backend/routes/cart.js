// backend/routes/cart.js
import { Router } from 'express'
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js'

const router = Router()

router.get('/:sessionId', getCart)
router.post('/add', addToCart)
router.delete('/item/:cartItemId', removeFromCart)

export default router