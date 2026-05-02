const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get all pending approvals for a manager
const getPendingApprovals = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const pendingProjects = await prisma.project.findMany({
      where: {
        analysePhase: {
          status: 'SUBMITTED'
        }
      },
      include: {
        user: { select: { name: true, email: true } },
        analysePhase: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.json(pendingProjects)
  } catch (error) {
    console.error('Get pending approvals error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get full analyse phase data for review
const getAnalysePhaseReview = async (req, res) => {
  try {
    const { projectId } = req.params

    const analysePhase = await prisma.analysePhase.findUnique({
      where: { projectId },
      include: {
        inputAnalysis: true,
        riskAssessment: true,
        jobTaskProfile: { include: { tasks: { include: { subTasks: true } } } },
        jobSpecification: true,
        targetPopulation: true,
        gapAnalysis: { include: { gapItems: true, overTraining: true } },
        feasibilityReport: { include: { options: true } },
        analyseOutput: true,
      }
    })

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: { select: { name: true, email: true } } }
    })

    res.json({ analysePhase, project })
  } catch (error) {
    console.error('Get analyse phase review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Approve analyse phase
const approveAnalysePhase = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { projectId } = req.params
    const { comments } = req.body

    const analysePhase = await prisma.analysePhase.update({
      where: { projectId },
      data: { status: 'APPROVED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'ANALYSE' },
      data: { status: 'APPROVED' }
    })

    await prisma.analyseOutput.updateMany({
      where: { analysePhaseId: analysePhase.id },
      data: {
        approvalStatus: 'APPROVED',
        approvalComments: comments || ''
      }
    })

    res.json({ message: 'Analyse Phase approved successfully' })
  } catch (error) {
    console.error('Approve analyse phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Reject analyse phase
const rejectAnalysePhase = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { projectId } = req.params
    const { comments } = req.body

    if (!comments) {
      return res.status(400).json({ message: 'Comments are required when rejecting' })
    }

    const analysePhase = await prisma.analysePhase.update({
      where: { projectId },
      data: { status: 'REJECTED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'ANALYSE' },
      data: { status: 'REJECTED' }
    })

    await prisma.analyseOutput.updateMany({
      where: { analysePhaseId: analysePhase.id },
      data: {
        approvalStatus: 'REJECTED',
        approvalComments: comments
      }
    })

    res.json({ message: 'Analyse Phase rejected' })
  } catch (error) {
    console.error('Reject analyse phase error:', error)
    res.status(500).json({ message: 'Server error' })


module.exports = {
  getPendingApprovals,
  getAnalysePhaseReview,
  approveAnalysePhase,
  rejectAnalysePhase
}