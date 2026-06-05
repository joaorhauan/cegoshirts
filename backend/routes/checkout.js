// backend/routes/checkout.js
import { Router } from 'express'
import { createCheckout } from '../controllers/checkoutController.js'

const router = Router()

router.post('/', createCheckout)

export default router