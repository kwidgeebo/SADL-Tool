const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getPendingApprovals,
  getAnalysePhaseReview,
  approveAnalysePhase,
  rejectAnalysePhase
} = require('../controllers/approvalsController')

router.get('/pending', auth, getPendingApprovals)
router.get('/analyse/:projectId', auth, getAnalysePhaseReview)
router.post('/analyse/:projectId/approve', auth, approveAnalysePhase)
router.post('/analyse/:projectId/reject', auth, rejectAnalysePhase)

module.exports = router