exports.up = function (knex) {
  return Promise.all([
    knex.schema.renameTable('order', 'purchase')
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.renameTable('purchase', 'order')
  ])
}
