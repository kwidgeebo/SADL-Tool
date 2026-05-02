const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
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
} = require('../controllers/analyseController')

router.get('/:projectId', auth, getAnalysePhase)
router.post('/:projectId/input-analysis', auth, saveInputAnalysis)
router.post('/:projectId/risk-assessment', auth, saveRiskAssessment)
router.post('/:projectId/job-task-profile', auth, saveJobTaskProfile)
router.post('/:projectId/job-specification', auth, saveJobSpecification)
router.post('/:projectId/target-population', auth, saveTargetPopulation)
router.post('/:projectId/gap-analysis', auth, saveGapAnalysis)
router.post('/:projectId/feasibility-report', auth, saveFeasibilityReport)
router.post('/:projectId/analyse-output', auth, saveAnalyseOutput)
router.post('/:projectId/submit', auth, submitForApproval)

module.exports = router