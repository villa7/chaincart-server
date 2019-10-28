exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('product', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onUpdate('CASCADE')
      t.integer('storefront').unsigned().references('storefront.id').onUpdate('CASCADE')
      t.string('name')
      t.string('sku')
      t.string('description')
      t.integer('price')
      t.integer('available')
      t.boolean('infinite')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('product')
  ])
}
