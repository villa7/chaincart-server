/* global Log User Passport RefreshToken HttpError */
const passport = require('passport')
const uuid = require('uuid/v4')
const TAG = 'AuthController'

passport.serializeUser(function (user, done) {
  // Log.d(TAG, 's user: ' + user.id)
  done(null, user.id)
})

passport.deserializeUser(async function (user, done) {
  const u = await User.findOne({ id: user })
  // Log.d(TAG, 'de user: ' + u.id)
  if (!u) return done(new Error('user not found: ' + user))
  done(null, u)
})

module.exports = {
  login: async (req, res, next) => {
    passport.authenticate('oauth2', { scope: ['user.name', 'user.email'] })(req, res, next)
  },
  loginCallback: async (req, res, next) => {
    passport.authenticate('oauth2', async (e, user, info, status) => {
      if (e) return Log.e(TAG, e)
      const accessToken = await AccessToken.create({ user })
      const refreshToken = await RefreshToken.findOne({ id: accessToken.refreshToken })

      req.login(user, () => {
        res.cookie('tok', JSON.stringify({
          access_token: accessToken.token,
          refresh_token: refreshToken.token,
          expires: accessToken.expiresAt
        }), { expiresAt: accessToken.expiresAt })
        if (req.query.next) {
          res.redirect(req.query.next)
        } else {
          if (process.env.NODE_ENV === 'development') return res.redirect('http://localhost:3000/box')
          res.redirect('/box')
        }
      })
    })(req, res, next)
  },
  token: async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    const u = await User.findOne({ email: username })
    if (!u) throw new HttpError(404, 'User not found')
    const p = await Passport.findOne({ user: u.id })
    if (!p) throw new HttpError(401, 'No password set')

    if (!(await p.validatePassword(password))) {
      throw new HttpError(400, 'Incorrect password')
    }

    const now = +(Date.now() / 1000).toFixed(0)
    const jwt = {
      id: uuid(),
      iss: 0,
      aud: 0,
      sub: u.id,
      exp: now + (60 * 60), // 1 hour access token expiration
      iat: now,
      token_type: 'bearer',
      scope: 'user.account'
    }
    const { jwtSign } = await boxes.helpers.crypto()
    
    const tok = await RefreshToken.create({
      user: u
    })
    const accessToken = await jwtSign(jwt)
    const refreshToken = await jwtSign({
      access_token: accessToken,
      token: tok.token,
      exp: now + (60 * 60 * 24 * 7), // 1 week refresh token expiration
      iat: now,
      sub: u.id,
      id: uuid()
    })
    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  },
  register: async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const passwordConfirmation = req.body.password_confirmation

    if (password !== passwordConfirmation) throw new HttpError(400, 'Passwords must match')

    const u = await User.findOne({ email: username })
    if (u) throw new HttpError(400, 'An account with that email already exists')

    try {
      const newUser = await User.create({
        email: username
      })
      await Passport.create({
        user: newUser,
        provider: 'local',
        identifier: password
      })
    } catch (e) {
      Log.e(TAG, e)
    }

    return res.status(201).json({ status: 201 })
  },
  recover: async (req, res, next) => {
    const email = req.body.username
    return res.status(501).json({ email })
  }
}
