module.exports = {
  UserController: {
    me: [ 'tokenAuth' ]
  },
  StoreController: {
    create: [ 'tokenAuth' ]
  }
}
