const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.userId },
      include: { phases: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Project title is required' })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.user.userId,
        phases: {
          create: [
            { type: 'ANALYSE', status: 'DRAFT' },
            { type: 'DESIGN', status: 'DRAFT' },
            { type: 'DEVELOP', status: 'DRAFT' },
            { type: 'IMPLEMENT', status: 'DRAFT' },
            { type: 'EVALUATE', status: 'DRAFT' }
          ]
        }
      },
      include: { phases: true }
    })

    res.status(201).json(project)
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId
      },
      include: { phases: true }
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getProjects, createProject, getProject }