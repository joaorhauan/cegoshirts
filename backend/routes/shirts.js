import { Router } from "express";
import multer from 'multer'
import { authenticate } from '../middleware/auth.js'
import {
    listShirts,
    getShirt,
    createShirt,
    updateShirt,
    deleteShirt,
} from '../controllers/shirtsController.js'


const router = Router();
const upload = multer({ storage: multer.memoryStorage() })


// public
router.get('/', listShirts)
router.get('/:id', getShirt)

//admin
router.post('/', authenticate, upload.single('image'), createShirt)
router.put('/:id', authenticate, upload.single('image'), updateShirt)
router.delete('/:id', authenticate, deleteShirt)


export default router