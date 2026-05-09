const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getDevelopPhase,
  savePromptSet,
  submitForApproval,
} = require('../controllers/developController')

router.get('/:projectId', auth, getDevelopPhase)
router.post('/:projectId/prompt-set', auth, savePromptSet)
router.post('/:projectId/submit', auth, submitForApproval)

module.exports = router
