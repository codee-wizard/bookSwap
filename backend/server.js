const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
require('dotenv').config()
const cors = require('cors')

const app = express()

app.use(cors());


dotenv.config()

connectDB()

app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})