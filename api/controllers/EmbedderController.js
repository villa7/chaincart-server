/* global boxes, Storefront, HttpError */
const TAG = 'EmbedderController'
const path = require('path')
const fs = require('fs')

const cssNamespace = (str, ns) => {
  if (!str) return ''
  return str.replace(/(^|\n)([.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?:\s+.+)?)(\s*[,{])/g, `$1${ns} $2$3`)
}
const template = (str, obj) => {
  for (const key in obj) {
    str = str.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`), obj[key])
  }
  return str
}

module.exports = {
  embedder: async (req, res, next) => {
    // const id = req.query.id
    return res.type('application/javascript').sendFile(path.join(__dirname, '../../public/embedder.js'))
  },
  app: async (req, res, next) => {
    return res.type('application/javascript').sendFile(path.join(__dirname, '../../public/index.bundle.js'))
  },
  css: async (req, res, next) => {
    return res.type('text/css').sendFile(path.join(__dirname, '../../public/index.css'))
  },
  customColor: async (req, res, next) => {
    const id = req.query.id
    const { unhash } = await boxes.helpers.crypto()
    const store = await Storefront.findOne({ id: unhash(id) })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    const str = fs.readFileSync(path.join(__dirname, '../../public/colors.css'), 'utf-8')

    return res.type('text/css').send(Buffer.from(cssNamespace(template(str, store.colors), '#chaincart-container')))
  },
  customDirection: async (req, res, next) => {
    const id = req.query.id
    const { unhash } = await boxes.helpers.crypto()
    const store = await Storefront.findOne({ id: unhash(id) })
    if (!store) throw new HttpError(404, 'Storefront does not exist')

    const type = (['modal', 'drawer'])[store.cartType]
    const file = `direction-${type}.css`

    return res.type('text/css').sendFile(path.join(__dirname, '../../public/', file))
  },
  customStyle: async (req, res, next) => {
    const id = req.query.id
    const { unhash } = await boxes.helpers.crypto()
    const store = await Storefront.findOne({ id: unhash(id) })
    if (!store) throw new HttpError(404, 'Storefront does not exist')
    if (!store.colors.css) return res.type('text/css').send(Buffer.from(''))

    return res.type('text/css').send(Buffer.from(cssNamespace(store.colors.css, '#chaincart-container')))
  }
}
