const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getDesignPhase,
  saveDes1InputAnalysis,
  saveDes2Environments,
  saveDes3LearningOutcomes,
  saveDes4CourseStructure,
  saveDesignOutput,
  submitForApproval,
} = require('../controllers/designController')

router.get('/:projectId', auth, getDesignPhase)
router.post('/:projectId/des1-input-analysis', auth, saveDes1InputAnalysis)
router.post('/:projectId/des2-environments', auth, saveDes2Environments)
router.post('/:projectId/des3-learning-outcomes', auth, saveDes3LearningOutcomes)
router.post('/:projectId/des4-course-structure', auth, saveDes4CourseStructure)
router.post('/:projectId/des5-output', auth, saveDesignOutput)
router.post('/:projectId/submit', auth, submitForApproval)

module.exports = router