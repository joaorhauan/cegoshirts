import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  registerClick,
  listClicks,
  clicksPerDay,
} from '../controllers/clicksController.js'

const router = Router()

// public
router.post('/:id', registerClick)

// admin
router.get('/', authenticate, listClicks)
router.get('/:id/por-dia', authenticate, clicksPerDay)

export default router