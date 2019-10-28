const TAG = 'PurchaseController'

module.exports = {
  list: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    const orders = await Purchase.where({ storefront: store })

    return res.json(orders.map(x => ({
      ...x,
      id: hash(x.id)
    })))
  },
  create: async (req, res, next) => {
    
  },
  delete: async (req, res, next) => {
    
  },
  edit: async (req, res, next) => {
    
  }
}
