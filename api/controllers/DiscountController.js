const TAG = 'DiscountController'

module.exports = {
  list: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')
    const products = await Discount.where({ storefront: store, latest: true, deleted: false })

    return res.json(products.map(x => ({
      ...x,
      id: hash(x.id)
    })))
  },
  create: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    const { code, amount, uses, infinite, ...data } = req.body
    if (!code || !code.trim().length) throw new HttpError(400, 'Code must not be empty')
    if (!amount) throw new HttpError(400, 'Amount must be greater than 0')
    if (!uses && !infinite) throw new HttpError(400, 'Infinite uses must be selected if available uses is 0')

    const discount = await Discount.create({
      user: req.user,
      storefront: store,
      ...req.body
    })
    await discount.update({
      hash: hash(discount.id)
    })
    return res.json(discount)
  },
  delete: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    // const productID = unhash(req.params.product)
    const discount = await Discount.findOne({ hash: req.params.discount, latest: true, deleted: false })
    if (!discount) throw new HttpError(404, 'Discount does not exist')

    await Discount.knex.raw('UPDATE discount SET deleted = true WHERE hash = ?', [req.params.discount])

    return res.json({
      status: 'ok',
      discountID: req.params.discount
    })
  },
  edit: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    const discountID = unhash(req.params.discount)
    const discount = await Discount.findOne({ hash: req.params.discount, latest: true, deleted: false })
    if (!discount) throw new HttpError(404, 'Discount does not exist')

    const { code, amount, uses, infinite, ...data } = req.body
    if (!code || !code.trim().length) throw new HttpError(400, 'Code must not be empty')
    if (!amount) throw new HttpError(400, 'Amount must be greater than 0')
    if (!uses && !infinite) throw new HttpError(400, 'Infinite uses must be selected if available uses is 0')

    const newDiscount = await Discount.create({
      ...discount,
      ...req.body
    })
    await discount.update({
      latest: false
    })
    
    return res.json(newDiscount)
  }
}
