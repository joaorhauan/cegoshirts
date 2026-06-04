import prisma from '../lib/prisma.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const listShirts = async (req, res) => {
  try {
    const shirts = await prisma.shirt.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(shirts)
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getShirt = async (req,res) => {
    const { id } = req.params
    try {
        const shirt = await prisma.shirt.findUnique({
            where: { id:Number(id) },
        })
        if (!shirt) return res.status(404).json({ error: "Shirt not found" })
        res.json(shirt)
    } catch (err) {
        console.error('ERRO:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createShirt = async (req,res) => {
    const { name, description, price, line, year, size, condition, babylook } = req.body

    try {
        if (!req.file) return res.status(400).json({ error: "Image required"})

        const upload = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'cegoshirts' },
                (err, result) => (err ? reject(err) : resolve(result))
            )
            stream.end(req.file.buffer)
        })

        const shirt = await prisma.shirt.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl: upload.secure_url,
                status: 'available',
                line: line || null,
                year: year ? parseInt(year) : null,
                size,
                condition, 
                babylook: babylook === 'true' || babylook === true,
            },
})

        res.status(201).json(shirt)
    } catch (err) {
        console.error('ERRO:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateShirt = async (req,res) => {
    const { id } = req.params
    const { name, description, price, status, line, year, size, condition, babylook } = req.body

    try {
        const data = {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(price && { price: parseFloat(price) }),
            ...(status && { status }),
            ...(line !== undefined && { line }),
            ...(year !== undefined && { year: year ? parseInt(year) : null }),
            ...(size && { size }),
            ...(condition && { condition }),
            ...(babylook !== undefined && { babylook: babylook === 'true' || babylook === true }),
        }

       if (req.file) {
        const upload = await new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'cegoshirts' },
                (err,result) => (err ? reject(err) : resolve(result))
            )
            stream.end(req.file.buffer)
        })
        dados.imageUrl = upload.secure_url
       } 

       const shirt = await prisma.shirt.update({
        where: { id: Number(id) },
        data: data,
       })

       res.json(shirt)
    } catch (err) {
        console.error('ERRO:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteShirt = async (req,res) => {
    const { id } = req.params
    try {
        await prisma.shirt.delete({ where: { id: Number(id) } })
        res.json({ msg: "Shirt deleted"})
    } catch (err) {
        console.error('ERRO:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}