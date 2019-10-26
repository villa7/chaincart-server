module.exports = {
  'POST /token': 'Auth#token',
  'POST /register': 'Auth#register',
  'POST /recover-password': 'Auth#recover',

  'GET /api/me': 'User#me'
}
