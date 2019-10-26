/* global boxes User HttpError */
module.exports = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    try {
      const { jwtVerify } = await boxes.helpers.crypto()
      const header = req.headers.authorization.substr(7)
      const data = await jwtVerify(header)
      const user = await User.findOne({ id: data.sub })
      // req.user = user
      req.login(user, () => {
        next()
      })
    } catch (e) {
      // Log.e('err', e)
      throw new HttpError(400, 'invalid authorization header')
    }
  } else {
    throw new HttpError(400, 'missing authorization header')
  }
}
