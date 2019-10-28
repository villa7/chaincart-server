const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.HASHIDS_SECRET || 'salty salt', 8)

function hmacSign (header, payload) {
  const value = `${header}:${payload}`
  const secret = process.env.HMAC_SECRET
  if (!secret) throw new Error('missing HMAC_SECRET')
  const hmac = crypto.createHmac('sha256', secret.toString()).update(value, 'utf-8').digest('hex')
  return hmac
}

function generateToken ({ bytes, base }) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) reject(err)
      else resolve(buf.toString(base || 'base64'))
    })
  })
}

function jwtSign (opts) {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) return reject(new Error('missing process.env.JWT_SECRET'))
    jwt.sign(opts, process.env.JWT_SECRET, function (e, token) {
      if (e) return reject(e)
      resolve(token)
    })
  })
}

function jwtVerify (token) {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) return reject(new Error('missing process.env.JWT_SECRET'))
    jwt.verify(token, process.env.JWT_SECRET, function (e, data) {
      if (e) return reject(e)
      resolve(data)
    })
  })
}

function hash (i) {
  if (typeof i !== 'number') throw new Error('hashids.encode expects a number')
  return hashids.encode(i)
}

function unhash (str) {
  if (typeof str !== 'string') throw new Error('hashids.decode expects a hash')
  return hashids.decode(str)[0]
}
module.exports = {
  hmacSign,
  generateToken,
  jwtSign,
  jwtVerify,
  hash,
  unhash
}
