import prisma from '../lib/prisma.js'

export const registerClick = async (req,res) => {
    const { id } = req.params

    try {
        await prisma.click.create({
            data: { shirtId: Number(id) }, 
        })
        res.status(201).json({ msg: "Click registered" })
    } catch {
        res.status(500).json({ error: "Error registering click "})
    }
}

export const listClicks = async (req, res) => {
  try {
    const shirts = await prisma.shirt.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        status: true,
        size: true,
        line: true,
        _count: {
          select: { clicks: true },
        },
      },
    })

    const result = shirts.map((s) => ({
      id: s.id,
      name: s.name,
      imageUrl: s.imageUrl,
      status: s.status,
      size: s.size,
      line: s.line,
      totalClicks: s._count.clicks,
    }))

    res.json(result)
  } catch (err) {
    console.error('ERRO:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}


export const clicksPerDay = async (req, res) => {
  const { id } = req.params

  try {
    const thirty_days_ago = new Date()
    thirty_days_ago.setDate(thirty_days_ago.getDate() - 30)

    const clicks = await prisma.click.findMany({
      where: {
        shirtId: Number(id),
        time: { gte: thirty_days_ago },
      },
      orderBy: { time: 'asc' },
    })

    // group by date
    const grouped = clicks.reduce((acc, click) => {
      const date = click.time.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const result = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }))

    res.json(result)
  } catch {
    res.status(500).json({ error: 'Error finding clicks per day' })
  }
}