const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const authRouter = require('./auth.routes')
const mongoose = require('mongoose')
const authMiddleware = require('./middleware/auth.middleware')

const app = express()

const PORT = 3000

app.use(bodyParser.json())
app.use('/auth', authRouter)

app.use('/', express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.use('/secretPage', authMiddleware, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'secretPage.html'))
})

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Igor:camel1234@cluster0.ctgvw7a.mongodb.net/?retryWrites=true&w=majority`)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()