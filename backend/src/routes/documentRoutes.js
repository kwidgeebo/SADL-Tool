const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { generateLessonPlan } = require('../controllers/documentController')

// GET /api/documents/:projectId/lesson-plan/:loId
router.get('/:projectId/lesson-plan/:loId', auth, generateLessonPlan)

module.exports = router