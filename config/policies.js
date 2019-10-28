module.exports = {
  UserController: {
    me: [ 'tokenAuth' ]
  },
  StoreController: {
    '*': [ 'tokenAuth' ]
  },
  ProductController: {
    '*': [ 'tokenAuth' ]
  },
  PurchaseController: {
    '*': [ 'tokenAuth' ]
  }
}
