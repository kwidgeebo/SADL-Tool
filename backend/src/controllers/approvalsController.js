const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get all pending approvals for a manager
const getPendingApprovals = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const pendingAnalyse = await prisma.project.findMany({
      where: { analysePhase: { status: 'SUBMITTED' } },
      include: {
        user: { select: { name: true, email: true } },
        analysePhase: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    const pendingDesign = await prisma.project.findMany({
      where: { designPhase: { status: 'SUBMITTED' } },
      include: {
        user: { select: { name: true, email: true } },
        designPhase: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.json({ pendingAnalyse, pendingDesign })
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
      data: { approvalStatus: 'APPROVED', approvalComments: comments || '' }
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
      data: { approvalStatus: 'REJECTED', approvalComments: comments }
    })

    res.json({ message: 'Analyse Phase rejected' })
  } catch (error) {
    console.error('Reject analyse phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get full design phase data for review
const getDesignPhaseReview = async (req, res) => {
  try {
    const { projectId } = req.params

    const designPhase = await prisma.designPhase.findUnique({
      where: { projectId },
      include: {
        des1InputAnalysis: true,
        des2Environments: true,
        des3LearningOutcomes: { include: { learningOutcomes: true } },
        des4CourseStructure: {
          include: {
            modules: {
              include: {
                formativeAssessments: true,
                summativeAssessments: true,
              }
            },
            evaluationPlan: true,
          }
        },
        designOutput: true,
      }
    })

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: { select: { name: true, email: true } } }
    })

    res.json({ designPhase, project })
  } catch (error) {
    console.error('Get design phase review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Approve design phase
const approveDesignPhase = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { projectId } = req.params
    const { comments } = req.body

    const designPhase = await prisma.designPhase.update({
      where: { projectId },
      data: { status: 'APPROVED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'DESIGN' },
      data: { status: 'APPROVED' }
    })

    await prisma.designOutput.updateMany({
      where: { designPhaseId: designPhase.id },
      data: { approvalStatus: 'APPROVED', approvalComments: comments || '' }
    })

    res.json({ message: 'Design Phase approved successfully' })
  } catch (error) {
    console.error('Approve design phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Reject design phase
const rejectDesignPhase = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const { projectId } = req.params
    const { comments } = req.body

    if (!comments) {
      return res.status(400).json({ message: 'Comments are required when rejecting' })
    }

    const designPhase = await prisma.designPhase.update({
      where: { projectId },
      data: { status: 'REJECTED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'DESIGN' },
      data: { status: 'REJECTED' }
    })

    await prisma.designOutput.updateMany({
      where: { designPhaseId: designPhase.id },
      data: { approvalStatus: 'REJECTED', approvalComments: comments }
    })

    res.json({ message: 'Design Phase rejected' })
  } catch (error) {
    console.error('Reject design phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getPendingApprovals,
  getAnalysePhaseReview,
  approveAnalysePhase,
  rejectAnalysePhase,
  getDesignPhaseReview,
  approveDesignPhase,
  rejectDesignPhase,
}