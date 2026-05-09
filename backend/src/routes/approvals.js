const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getPendingApprovals,
  getAnalysePhaseReview,
  approveAnalysePhase,
  rejectAnalysePhase,
  getDesignPhaseReview,
  approveDesignPhase,
  rejectDesignPhase,
} = require('../controllers/approvalsController')

router.get('/pending', auth, getPendingApprovals)

router.get('/analyse/:projectId', auth, getAnalysePhaseReview)
router.post('/analyse/:projectId/approve', auth, approveAnalysePhase)
router.post('/analyse/:projectId/reject', auth, rejectAnalysePhase)

router.get('/design/:projectId', auth, getDesignPhaseReview)
router.post('/design/:projectId/approve', auth, approveDesignPhase)
router.post('/design/:projectId/reject', auth, rejectDesignPhase)

module.exports = router