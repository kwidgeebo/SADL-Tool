const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getProjects,
  createProject,
  getProject
} = require('../controllers/projectsController')

router.get('/', auth, getProjects)
router.post('/', auth, createProject)
router.get('/:id', auth, getProject)

module.exports = router