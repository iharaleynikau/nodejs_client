const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secret } = require('./config')
const { validationResult } = require('express-validator')

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  }

  return jwt.sign(payload, secret, { expiresIn: '24h' })

}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors })
      }

      const { username, password } = req.body
      const candidate = await User.findOne({ username })

      if (candidate) {
        return res.status(400).json({ message: 'such user already exists' })
      }

      const hashPassword = bcrypt.hashSync(password, 7)

      const user = new User({ username, password: hashPassword })

      await user.save()

      return res.json({ message: 'user has been successfully registered' })

    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'registration error' })
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors })
      }

      const { username, password } = req.body
      const user = await User.findOne({ username })

      if (!user) {
        return setTimeout(() => res.status(400).json({
          message: 'user with such name not found'
        }), 3000)
      }

      const isValidPassword = bcrypt.compareSync(password, user.password)

      if (!isValidPassword) {
        return res.status(400).json({ errors: [{ path: 'password', msg: 'incorrect password' }] })
      }

      const token = generateAccessToken(user._id, user.username)

      return res.json({ token })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'login error' })
    }
  }
}

module.exports = new authController()