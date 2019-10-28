exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('customer', t => {
      t.increments('id').primary()
      t.string('email')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('discount', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onUpdate('CASCADE')
      t.integer('storefront').unsigned().references('storefront.id').onUpdate('CASCADE')
      t.string('code')
      t.integer('type')
      t.integer('amount')
      t.integer('uses')
      t.integer('infinite')
      t.bigInteger('valid_from')
      t.bigInteger('valid_to')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('order', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onUpdate('CASCADE')
      t.integer('storefront').unsigned().references('storefront.id').onUpdate('CASCADE')
      t.integer('customer').unsigned().references('customer.id').onUpdate('CASCADE')
      t.integer('discount').unsigned().references('discount.id').onUpdate('CASCADE')
      t.integer('price')
      t.json('products')
      t.integer('status')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('order'),
    knex.schema.dropTable('discount'),
    knex.schema.dropTable('customer')
  ])
}
