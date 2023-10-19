const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const PORT = 3000

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.get('/testGet', (req, res) => res.send('Hello World!'))

app.post('/testPost', function (req, res) {
  if (req.body.user === 'Peter' && req.body.password === '1234') {
    res.send('200 OK')
  } else {
    res.send('500 ERROR')
  }
});


app.listen(PORT, () => console.log(`Server localhost:${PORT} has been started`))