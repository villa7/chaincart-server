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
    const valid = await bcrypt.compare(pass, this.identifier)
    return valid
  },

  beforeCreate: async function (self) {
    const hashed = await bcrypt.hash(self.identifier, 10)
    self.identifier = hashed
  }
}
