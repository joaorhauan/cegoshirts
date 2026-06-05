import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import shirtRoutes from './routes/shirts.js'
import clicksRoutes from './routes/clicks.js'
import authRoutes from './routes/auth.js'
import ordersRoutes from './routes/orders.js'
import checkoutRoutes from './routes/checkout.js'
import webhookRoutes from './routes/webhook.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/shirts', shirtRoutes)
app.use('/api/clicks', clicksRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/webhook', webhookRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})