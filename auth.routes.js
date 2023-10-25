const Router = require('express')
const router = new Router()
const controller = require('./auth.controller')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/auth.middleware')

router.post(
  '/registration',
  [
    check('username', 'name field must not be empty').notEmpty(),
    check('password', 'password must be more than 4 characters').isLength({ min: 4, max: 30 }),
  ],
  controller.registration
)
router.post('/login',
  [
    check('username', 'name field must not be empty').notEmpty(),
    check('password', 'password must be more than 4 characters').isLength({ min: 4, max: 30 }),
  ],
  controller.login)

module.exports = router
