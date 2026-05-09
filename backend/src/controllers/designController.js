const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Helper
const getOrCreateDesignPhase = async (projectId) => {
  let designPhase = await prisma.designPhase.findUnique({
    where: { projectId }
  })
  if (!designPhase) {
    designPhase = await prisma.designPhase.create({
      data: { projectId }
    })
  }
  return designPhase
}

// Full include block reused in both findUnique and create
const designPhaseInclude = {
  project: {
    include: {
      analysePhase: {
        include: {
          jobTaskProfile: {
            include: {
              tasks: {
                include: { subTasks: true },
                orderBy: { taskNumber: 'asc' }
              }
            }
          },
          targetPopulation: true,
        }
      }
    }
  },
  des1InputAnalysis: true,
  des2Environments: true,
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
  designOutput: true,
}

// Get or create design phase for a project
const getDesignPhase = async (req, res) => {
  try {
    const { projectId } = req.params

    let designPhase = await prisma.designPhase.findUnique({
      where: { projectId },
      include: designPhaseInclude
    })

    if (!designPhase) {
      designPhase = await prisma.designPhase.create({
        data: { projectId },
        include: designPhaseInclude
      })
    }

    res.json(designPhase)
  } catch (error) {
    console.error('Get design phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Des1 - Save Input Analysis
const saveDes1InputAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params
    const designPhase = await getOrCreateDesignPhase(projectId)

    const inputAnalysis = await prisma.des1InputAnalysis.upsert({
      where: { designPhaseId: designPhase.id },
      update: req.body,
      create: { ...req.body, designPhaseId: designPhase.id }
    })

    res.json(inputAnalysis)
  } catch (error) {
    console.error('Save Des1 input analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Des2 - Save Environments Analysis
const saveDes2Environments = async (req, res) => {
  try {
    const { projectId } = req.params
    const designPhase = await getOrCreateDesignPhase(projectId)

    const environments = await prisma.des2Environments.upsert({
      where: { designPhaseId: designPhase.id },
      update: req.body,
      create: { ...req.body, designPhaseId: designPhase.id }
    })

    res.json(environments)
  } catch (error) {
    console.error('Save Des2 environments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Des3 - Save Learning Outcomes
const saveDes3LearningOutcomes = async (req, res) => {
  try {
    const { projectId } = req.params
    const { learningOutcomes, ...des3Data } = req.body
    const designPhase = await getOrCreateDesignPhase(projectId)

    let des3 = await prisma.des3LearningOutcomes.findUnique({
      where: { designPhaseId: designPhase.id }
    })

    if (des3) {
      await prisma.learningOutcome.deleteMany({
        where: { des3Id: des3.id }
      })
      des3 = await prisma.des3LearningOutcomes.update({
        where: { designPhaseId: designPhase.id },
        data: des3Data
      })
    } else {
      des3 = await prisma.des3LearningOutcomes.create({
        data: { ...des3Data, designPhaseId: designPhase.id }
      })
    }

    if (learningOutcomes && learningOutcomes.length > 0) {
      await prisma.learningOutcome.createMany({
        data: learningOutcomes.map(lo => ({ ...lo, des3Id: des3.id }))
      })
    }

    const updated = await prisma.des3LearningOutcomes.findUnique({
      where: { id: des3.id },
      include: { learningOutcomes: true }
    })

    res.json(updated)
  } catch (error) {
    console.error('Save Des3 learning outcomes error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Des4 - Save Course Structure
const saveDes4CourseStructure = async (req, res) => {
  try {
    const { projectId } = req.params
    const { modules, evaluationPlan, ...des4Data } = req.body
    const designPhase = await getOrCreateDesignPhase(projectId)

    let des4 = await prisma.des4CourseStructure.findUnique({
      where: { designPhaseId: designPhase.id }
    })

    if (des4) {
      const existingModules = await prisma.module.findMany({
        where: { des4Id: des4.id }
      })
      for (const mod of existingModules) {
        await prisma.formativeAssessment.deleteMany({ where: { moduleId: mod.id } })
        await prisma.summativeAssessment.deleteMany({ where: { moduleId: mod.id } })
      }
      await prisma.module.deleteMany({ where: { des4Id: des4.id } })
      await prisma.evaluationPlan.deleteMany({ where: { des4Id: des4.id } })

      des4 = await prisma.des4CourseStructure.update({
        where: { designPhaseId: designPhase.id },
        data: des4Data
      })
    } else {
      des4 = await prisma.des4CourseStructure.create({
        data: { ...des4Data, designPhaseId: designPhase.id }
      })
    }

    if (modules && modules.length > 0) {
      for (const mod of modules) {
        const { formativeAssessments, summativeAssessments, ...modData } = mod
        const createdModule = await prisma.module.create({
          data: { ...modData, des4Id: des4.id }
        })
        if (formativeAssessments && formativeAssessments.length > 0) {
          await prisma.formativeAssessment.createMany({
            data: formativeAssessments.map(fa => ({ ...fa, moduleId: createdModule.id }))
          })
        }
        if (summativeAssessments && summativeAssessments.length > 0) {
          await prisma.summativeAssessment.createMany({
            data: summativeAssessments.map(sa => ({ ...sa, moduleId: createdModule.id }))
          })
        }
      }
    }

    if (evaluationPlan && evaluationPlan.length > 0) {
      await prisma.evaluationPlan.createMany({
        data: evaluationPlan.map(ep => ({ ...ep, des4Id: des4.id }))
      })
    }

    const updated = await prisma.des4CourseStructure.findUnique({
      where: { id: des4.id },
      include: {
        modules: {
          include: {
            formativeAssessments: true,
            summativeAssessments: true,
          }
        },
        evaluationPlan: true,
      }
    })

    res.json(updated)
  } catch (error) {
    console.error('Save Des4 course structure error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Des5 - Save Design Output
const saveDesignOutput = async (req, res) => {
  try {
    const { projectId } = req.params
    const designPhase = await getOrCreateDesignPhase(projectId)

    const output = await prisma.designOutput.upsert({
      where: { designPhaseId: designPhase.id },
      update: req.body,
      create: { ...req.body, designPhaseId: designPhase.id }
    })

    res.json(output)
  } catch (error) {
    console.error('Save design output error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit for approval
const submitForApproval = async (req, res) => {
  try {
    const { projectId } = req.params
    const designPhase = await getOrCreateDesignPhase(projectId)

    const updated = await prisma.designPhase.update({
      where: { id: designPhase.id },
      data: { status: 'SUBMITTED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'DESIGN' },
      data: { status: 'SUBMITTED' }
    })

    res.json(updated)
  } catch (error) {
    console.error('Submit design for approval error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getDesignPhase,
  saveDes1InputAnalysis,
  saveDes2Environments,
  saveDes3LearningOutcomes,
  saveDes4CourseStructure,
  saveDesignOutput,
  submitForApproval,
}
