const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Helper
const getOrCreateDevelopPhase = async (projectId) => {
  let developPhase = await prisma.developPhase.findUnique({
    where: { projectId }
  })
  if (!developPhase) {
    developPhase = await prisma.developPhase.create({
      data: { projectId }
    })
  }
  return developPhase
}

const developPhaseInclude = {
  project: {
    include: {
      designPhase: {
        include: {
          des1InputAnalysis: true,
          des3LearningOutcomes: {
            include: { learningOutcomes: true }
          },
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
        }
      }
    }
  },
  promptSets: true,
  developOutput: true,
}

// Get or create develop phase for a project
const getDevelopPhase = async (req, res) => {
  try {
    const { projectId } = req.params

    let developPhase = await prisma.developPhase.findUnique({
      where: { projectId },
      include: developPhaseInclude
    })

    if (!developPhase) {
      developPhase = await prisma.developPhase.create({
        data: { projectId },
        include: developPhaseInclude
      })
    }

    res.json(developPhase)
  } catch (error) {
    console.error('Get develop phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Save or update a prompt set (mark as copied, add notes)
const savePromptSet = async (req, res) => {
  try {
    const { projectId } = req.params
    const { promptType, referenceId, referenceName, notes, copied } = req.body
    const developPhase = await getOrCreateDevelopPhase(projectId)

    // Upsert based on developPhaseId + promptType + referenceId
    const existing = await prisma.promptSet.findFirst({
      where: {
        developPhaseId: developPhase.id,
        promptType,
        referenceId,
      }
    })

    let promptSet
    if (existing) {
      promptSet = await prisma.promptSet.update({
        where: { id: existing.id },
        data: {
          notes: notes ?? existing.notes,
          copied: copied ?? existing.copied,
          copiedAt: copied && !existing.copied ? new Date() : existing.copiedAt,
        }
      })
    } else {
      promptSet = await prisma.promptSet.create({
        data: {
          developPhaseId: developPhase.id,
          promptType,
          referenceId,
          referenceName,
          notes: notes || null,
          copied: copied || false,
          copiedAt: copied ? new Date() : null,
        }
      })
    }

    res.json(promptSet)
  } catch (error) {
    console.error('Save prompt set error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit develop phase for approval
const submitForApproval = async (req, res) => {
  try {
    const { projectId } = req.params
    const developPhase = await getOrCreateDevelopPhase(projectId)

    const updated = await prisma.developPhase.update({
      where: { id: developPhase.id },
      data: { status: 'SUBMITTED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'DEVELOP' },
      data: { status: 'SUBMITTED' }
    })

    // Upsert develop output record
    await prisma.developOutput.upsert({
      where: { developPhaseId: developPhase.id },
      update: { approvalStatus: 'PENDING' },
      create: { developPhaseId: developPhase.id, approvalStatus: 'PENDING' }
    })

    res.json(updated)
  } catch (error) {
    console.error('Submit develop phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getDevelopPhase,
  savePromptSet,
  submitForApproval,
}
