import jwt from 'jsonwebtoken'

export const authenticate = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token not found"})
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.adminId = payload.id
        next()
    } catch {
        res.status(401).json({ error: "Invalid token" })
    }
}