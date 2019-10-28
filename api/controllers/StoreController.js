/* global Log */
const TAG = 'StoreController'

module.exports = {
  list: async (req, res, next) => {
    const stores = await Storefront.knex.raw(`
      SELECT s.*, COUNT(p.*) as product_count, COUNT(c.*) as customer_count, COUNT(o.*) as order_count,
      SUM(o.price) as revenue, AVG(o.price) as average_purchase
      FROM storefront s
      LEFT JOIN purchase o ON s.id = o.storefront
      LEFT JOIN product p ON s.id = p.storefront AND p.latest = true AND p.deleted = false
      LEFT JOIN customer c ON s.id = o.storefront AND o.customer = c.id
      WHERE s.user = ?
      GROUP BY s.id
      `, [req.user.id])
    const { hash } = await boxes.helpers.crypto()

    return res.json(stores.rows.map(x => ({
      ...Storefront.camelize(x),
      id: hash(x.id)
    })))
  },
  create: async (req, res, next) => {
    const { name } = req.body
    if (!name || !name.length) throw new HttpError(400, 'Storefront must have a name')

    const newStorefront = await Storefront.create({
      user: req.user,
      name,
      cartType: 0,
      drawerDirection: 1,
      colors: {
        primary: '#676ECE',
        primaryText: '#ffffff',
        secondary: '#dddddd',
        secondaryText: '#555555',
        accent: '#865EA0',
        accentText: '#ffffff',
        css: ``
      }
    })

    return res.json({
      ...newStorefront,
      averagePurchase: 0,
      revenue: 0,
      productCount: 0,
      orderCount: 0,
      customerCount: 0
    })
  },
  edit: async (req, res, next) => {
    const { name } = req.body
    if (name && !name.length) throw new HttpError(400, 'Storefront must have a name')
    const { hash, unhash } = await boxes.helpers.crypto()
    const storeID = unhash(req.params.id)
    const store = await Storefront.findOne({ id: storeID, user: req.user })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    await store.update(req.body)

    return res.json(store)
  },
  delete: async (req, res, next) => {

  }
}
