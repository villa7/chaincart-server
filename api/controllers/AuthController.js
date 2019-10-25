/* global Log User Passport RefreshToken HttpError */
const passport = require('passport')
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
    const p = await Passport.findOne({ user: u })
    if (!p) throw new HttpError(401, 'No password set')

    if (!p.validatePassword(password)) throw new HttpError(403, 'Incorrect password')
    


    return res.json({ status: 'ok' })
  },
  register: async (req, res, next) => {
    
  }
}
