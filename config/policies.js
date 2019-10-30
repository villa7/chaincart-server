module.exports = {
  UserController: {
    me: ['tokenAuth']
  },
  StoreController: {
    '*': ['tokenAuth']
  },
  ProductController: {
    list: ['tokenAuth'],
    create: ['tokenAuth'],
    edit: ['tokenAuth'],
    delete: ['tokenAuth']
  },
  PurchaseController: {
    '*': ['tokenAuth']
  },
  DiscountController: {
    list: ['tokenAuth'],
    create: ['tokenAuth'],
    edit: ['tokenAuth'],
    delete: ['tokenAuth'],
    details: ['ipAuth']
  }
}
