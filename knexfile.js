const env = require('./environment')
for (const key in env) {
  process.env[key] = env[key]
}

module.exports = {
  client: 'pg',
  connection: process.env.DB_CONNECTION || { user: 'me', database: 'my_app' }
}
