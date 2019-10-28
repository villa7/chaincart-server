const shortid = require('shortid')

module.exports = {
  hash: 'string',
  user: {
    references: 'user'
  },
  storefront: {
    references: 'storefront'
  },
  name: 'string',
  sku: 'string',
  description: 'string',
  price: 'number',
  available: 'number',
  infinite: 'boolean',
  latest: 'boolean',
  deleted: 'boolean',

  async beforeCreate (self) {
    self.sku = shortid.generate()
  }
}
