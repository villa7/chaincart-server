exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('storefront', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('name')
      t.integer('cart_type')
      t.integer('drawer_direction')
      t.json('colors')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('storefront')
  ])
}
