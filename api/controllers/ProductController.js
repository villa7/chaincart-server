const TAG = 'ProductController'

module.exports = {
  list: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    const products = await Product.where({ storefront: store, latest: true, deleted: false })

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

    const { name, available, infinite, price, ...data } = req.body
    if (!name || !name.trim().length) throw new HttpError(400, 'Name must not be empty')

    if (!available && !infinite) throw new HttpError(400, 'Infinite stock must be selected if available stock is 0')

    const product = await Product.create({
      user: req.user,
      storefront: store,
      name, available, infinite,
      price,
      ...data
    })
    await product.update({
      hash: hash(product.id)
    })
    return res.json(product)
  },
  delete: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    // const productID = unhash(req.params.product)
    const product = await Product.findOne({ hash: req.params.product, latest: true, deleted: false })
    if (!product) throw new HttpError(404, 'Product does not exist')

    await Product.knex.raw('UPDATE product SET deleted = true WHERE hash = ?', [req.params.product])

    return res.json({
      status: 'ok',
      productID: req.params.product
    })
  },
  edit: async (req, res, next) => {
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    const productID = unhash(req.params.product)
    const product = await Product.findOne({ hash: req.params.product, latest: true, deleted: false })
    if (!product) throw new HttpError(404, 'Product does not exist')

    const newProduct = await Product.create({
      ...product,
      ...req.body
    })
    await product.update({
      latest: false
    })
    
    return res.json(newProduct)
  }
}
