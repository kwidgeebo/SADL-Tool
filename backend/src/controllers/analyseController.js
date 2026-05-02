const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get or create analyse phase for a project
const getAnalysePhase = async (req, res) => {
  try {
    const { projectId } = req.params

    let analysePhase = await prisma.analysePhase.findUnique({
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

    if (!analysePhase) {
      analysePhase = await prisma.analysePhase.create({
        data: { projectId },
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
    }

    res.json(analysePhase)
  } catch (error) {
    console.error('Get analyse phase error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// A1 - Save Input Analysis
const saveInputAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const inputAnalysis = await prisma.inputAnalysis.upsert({
      where: { analysePhaseId: analysePhase.id },
      update: req.body,
      create: { ...req.body, analysePhaseId: analysePhase.id }
    })

    res.json(inputAnalysis)
  } catch (error) {
    console.error('Save input analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP2 - Save Risk Assessment
const saveRiskAssessment = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const riskAssessment = await prisma.riskAssessment.upsert({
      where: { analysePhaseId: analysePhase.id },
      update: req.body,
      create: { ...req.body, analysePhaseId: analysePhase.id }
    })

    res.json(riskAssessment)
  } catch (error) {
    console.error('Save risk assessment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP3 - Save Job Task Profile
const saveJobTaskProfile = async (req, res) => {
  try {
    const { projectId } = req.params
    const { tasks, ...profileData } = req.body
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    let jobTaskProfile = await prisma.jobTaskProfile.findUnique({
      where: { analysePhaseId: analysePhase.id }
    })

    if (jobTaskProfile) {
      await prisma.subTask.deleteMany({
        where: { jobTask: { jobTaskProfileId: jobTaskProfile.id } }
      })
      await prisma.jobTask.deleteMany({
        where: { jobTaskProfileId: jobTaskProfile.id }
      })
      jobTaskProfile = await prisma.jobTaskProfile.update({
        where: { analysePhaseId: analysePhase.id },
        data: profileData
      })
    } else {
      jobTaskProfile = await prisma.jobTaskProfile.create({
        data: { ...profileData, analysePhaseId: analysePhase.id }
      })
    }

    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        const { subTasks, ...taskData } = task
        const createdTask = await prisma.jobTask.create({
          data: { ...taskData, jobTaskProfileId: jobTaskProfile.id }
        })
        if (subTasks && subTasks.length > 0) {
          await prisma.subTask.createMany({
            data: subTasks.map(st => ({
              ...st,
              jobTaskId: createdTask.id
            }))
          })
        }
      }
    }

    const updated = await prisma.jobTaskProfile.findUnique({
      where: { id: jobTaskProfile.id },
      include: { tasks: { include: { subTasks: true } } }
    })

    res.json(updated)
  } catch (error) {
    console.error('Save job task profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP4 - Save Job Specification
const saveJobSpecification = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const jobSpec = await prisma.jobSpecification.upsert({
      where: { analysePhaseId: analysePhase.id },
      update: req.body,
      create: { ...req.body, analysePhaseId: analysePhase.id }
    })

    res.json(jobSpec)
  } catch (error) {
    console.error('Save job specification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP5 - Save Target Population
const saveTargetPopulation = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const targetPop = await prisma.targetPopulationProfile.upsert({
      where: { analysePhaseId: analysePhase.id },
      update: req.body,
      create: { ...req.body, analysePhaseId: analysePhase.id }
    })

    res.json(targetPop)
  } catch (error) {
    console.error('Save target population error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP6 - Save Gap Analysis
const saveGapAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params
    const { gapItems, overTraining, ...gapData } = req.body
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    let gapAnalysis = await prisma.gapAnalysisStatement.findUnique({
      where: { analysePhaseId: analysePhase.id }
    })

    if (gapAnalysis) {
      await prisma.gapItem.deleteMany({ where: { gapAnalysisId: gapAnalysis.id } })
      await prisma.overTrainingItem.deleteMany({ where: { gapAnalysisId: gapAnalysis.id } })
      gapAnalysis = await prisma.gapAnalysisStatement.update({
        where: { analysePhaseId: analysePhase.id },
        data: gapData
      })
    } else {
      gapAnalysis = await prisma.gapAnalysisStatement.create({
        data: { ...gapData, analysePhaseId: analysePhase.id }
      })
    }

    if (gapItems && gapItems.length > 0) {
      await prisma.gapItem.createMany({
        data: gapItems.map(item => ({ ...item, gapAnalysisId: gapAnalysis.id }))
      })
    }

    if (overTraining && overTraining.length > 0) {
      await prisma.overTrainingItem.createMany({
        data: overTraining.map(item => ({ ...item, gapAnalysisId: gapAnalysis.id }))
      })
    }

    const updated = await prisma.gapAnalysisStatement.findUnique({
      where: { id: gapAnalysis.id },
      include: { gapItems: true, overTraining: true }
    })

    res.json(updated)
  } catch (error) {
    console.error('Save gap analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AP7 - Save Feasibility Report
const saveFeasibilityReport = async (req, res) => {
  try {
    const { projectId } = req.params
    const { options, ...reportData } = req.body
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    let feasReport = await prisma.feasibilityReport.findUnique({
      where: { analysePhaseId: analysePhase.id }
    })

    if (feasReport) {
      await prisma.feasibilityOption.deleteMany({
        where: { feasibilityReportId: feasReport.id }
      })
      feasReport = await prisma.feasibilityReport.update({
        where: { analysePhaseId: analysePhase.id },
        data: reportData
      })
    } else {
      feasReport = await prisma.feasibilityReport.create({
        data: { ...reportData, analysePhaseId: analysePhase.id }
      })
    }

    if (options && options.length > 0) {
      await prisma.feasibilityOption.createMany({
        data: options.map(opt => ({ ...opt, feasibilityReportId: feasReport.id }))
      })
    }

    const updated = await prisma.feasibilityReport.findUnique({
      where: { id: feasReport.id },
      include: { options: true }
    })

    res.json(updated)
  } catch (error) {
    console.error('Save feasibility report error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// A4 - Save Analyse Output
const saveAnalyseOutput = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const output = await prisma.analyseOutput.upsert({
      where: { analysePhaseId: analysePhase.id },
      update: req.body,
      create: { ...req.body, analysePhaseId: analysePhase.id }
    })

    res.json(output)
  } catch (error) {
    console.error('Save analyse output error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Submit for approval
const submitForApproval = async (req, res) => {
  try {
    const { projectId } = req.params
    const analysePhase = await getOrCreateAnalysePhase(projectId)

    const updated = await prisma.analysePhase.update({
      where: { id: analysePhase.id },
      data: { status: 'SUBMITTED' }
    })

    await prisma.phase.updateMany({
      where: { projectId, type: 'ANALYSE' },
      data: { status: 'SUBMITTED' }
    })

    res.json(updated)
  } catch (error) {
    console.error('Submit for approval error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Helper
const getOrCreateAnalysePhase = async (projectId) => {
  let analysePhase = await prisma.analysePhase.findUnique({
    where: { projectId }
  })
  if (!analysePhase) {
    analysePhase = await prisma.analysePhase.create({
      data: { projectId }
    })
  }
  return analysePhase
}

module.exports = {
  getAnalysePhase,
  saveInputAnalysis,
  saveRiskAssessment,
  saveJobTaskProfile,
  saveJobSpecification,
  saveTargetPopulation,
  saveGapAnalysis,
  saveFeasibilityReport,
  saveAnalyseOutput,
  submitForApproval
}