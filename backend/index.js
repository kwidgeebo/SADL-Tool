const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'SADL Tool API is running' })
})

// Routes (we will add these as we build)
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/projects', require('./src/routes/projects'))
app.use('/api/analyse', require('./src/routes/analyse'))
app.use('/api/approvals', require('./src/routes/approvals'))

console.log('Auth routes loaded')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})