exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('product', t => {
      t.boolean('latest').defaultTo(true)
      t.boolean('deleted').defaultTo(false)
    }),
    knex.schema.table('discount', t => {
      t.boolean('latest').defaultTo(true)
      t.boolean('deleted').defaultTo(false)
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('product', t => {
      t.dropColumn('latest')
      t.dropColumn('deleted')
    }),
    knex.schema.table('discount', t => {
      t.dropColumn('latest')
      t.dropColumn('deleted')
    })
  ])
}
