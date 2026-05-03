import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import shirtRoutes from './routes/shirts.js'
import clicksRoutes from './routes/clicks.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/shirts', shirtRoutes)
app.use('/api/clicks', clicksRoutes)
app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})