import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export const login = async (req,res) => {
    const { email, password } = req.body;


    try {
        const admin = await prisma.admin.findUnique({where: { email }})

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }

        const correctPassword = await bcrypt.compare(password, admin.password)

        if (!correctPassword) {
            return res.status(401).json({ error: "Invalid credentials"})
        }

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: 'Server error'})
    }
}
