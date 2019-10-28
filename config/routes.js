module.exports = {
  'POST /token': 'Auth#token',
  'POST /register': 'Auth#register',
  'POST /recover-password': 'Auth#recover',

  'GET /stores': 'Store#list',
  'POST /stores/create': 'Store#create',
  'PATCH /stores/:id': 'Store#edit',
  'DELETE /stores/:id': 'Store#delete',

  'GET /stores/:id/products': 'Product#list',
  'POST /stores/:id/products': 'Product#create',
  'PATCH /stores/:id/products/:product': 'Product#edit',
  'DELETE /stores/:id/products/:product': 'Product#delete',

  'GET /stores/:id/purchases': 'Purchase#list',
}
