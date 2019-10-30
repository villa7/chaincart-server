module.exports = async (req, res, next) => {
  res.locals.ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
  next()
}
