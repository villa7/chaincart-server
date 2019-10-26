const bcrypt = require('bcrypt')

module.exports = {
  user: {
    references: 'user'
  },
  provider: {
    type: 'string'
  },
  identifier: {
    type: 'string'
  },
  accessToken: 'string',
  refreshToken: 'string',

  validatePassword: async function (pass) {
    return bcrypt.compare(pass, this.identifier)
  },

  beforeCreate: async function (self) {
    if (self.provider === 'local') {
      const hashed = await bcrypt.hash(self.identifier, 10)
      self.identifier = hashed
    }
  }
}
