exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('product', t => {
      t.string('hash')
    }),
    knex.schema.table('discount', t => {
      t.string('hash')
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('product', t => {
      t.dropColumn('hash')
    }),
    knex.schema.table('discount', t => {
      t.dropColumn('hash')
    })
  ])
}
