/* global Log HttpError */
global.Log = require('./Log')
global.HttpError = require('./HttpError')
const path = require('path')
const fs = require('fs')
const TAG = 'server'
const sourcePath = p => path.join('../', p)

const routes = require(sourcePath('config/routes'))
const middleware = require(sourcePath('config/middleware'))
const policyTree = require(sourcePath('config/policies'))
const express = require('express')
const PORT = process.env.PORT || 3001

process.on('unhandledRejection', (e, p) => {
  Log.e(TAG, 'Unhandled Rejection at: Promise', p)
  Log.e(TAG, e)
})

const debugMiddleware = (v, c, a, p) => (re, rq, n) => {
  Log.d(TAG, `Handling ${v.toUpperCase()} ${p} (${c}#${a})`)
  n()
}

const errorHandler = (func) => async (req, res, next) => {
  try {
    return await func(req, res, next)
  } catch (e) {
    if (e instanceof HttpError) {
      return e.http(res)
    } else {
      Log.e(TAG, e)
      return res.status(500).json({
        status: 500,
        message: req.headers.origin && req.headers.origin.indexOf('localhost') > -1 ? e.toString() : ''
      })
    }
  }
}

module.exports = class BoxServer {
  async raise () {
    const loadModels = require('./Models')
    const app = express()
    const server = require('http').Server(app)
    this.server = server
    this.app = app
    this.controllers = {}
    this.policies = {}
    if (global.boxes) throw new Error('global.boxes already in use')
    global.boxes = {}

    app.options('/*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', ['http://localhost:8080', 'http://localhost:3000'].indexOf(req.headers.origin) > -1 ? req.headers.origin : '')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
      res.sendStatus(200)
    })

    await this.loadControllers()
    await this.loadMiddleware()

    await loadModels()
    await this.loadHelpers()

    server.listen(PORT, () => {
      Log.i(TAG, `Express running on :${PORT}`)
    })
  }

  async loadRoutes () {
    for (const route in routes) {
      const verb = route.split(' ')[0].toLowerCase()
      const pth = route.substr(verb.length + 1)
      const str = routes[route]
      if (typeof str === 'string') {
        const controller = str.split('#')[0]
        const action = str.split('#')[1]
        if (this.controllers[controller]) {
          if (this.controllers[controller][action]) {
            let globalPolicy = []
            let actionPolicies = []
            if (this.policies[controller]) {
              globalPolicy = (this.policies[controller]['*'] || []).map(f => errorHandler(f))
              actionPolicies = (this.policies[controller][action] || []).map(f => errorHandler(f))
            }

            this.app[verb](pth,
              debugMiddleware(verb, controller, action, pth),
              ...globalPolicy,
              ...actionPolicies,
              errorHandler(this.controllers[controller][action]))
          } else {
            Log.e(TAG, `could not find action: ${str}`)
          }
        } else {
          Log.e(TAG, 'could not find controller: ' + controller)
        }
      }
    }
  }

  loadControllers () {
    const self = this
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(path.join(__dirname, sourcePath('api/controllers'))), async (err, files) => {
        if (err) throw err
        for (const file of files) {
          try {
            const name = file.replace('Controller', '').replace('.js', '')
            self.controllers[name] = require(sourcePath(`api/controllers/${file}`))
            Log.d(TAG, `registered controller: ${name}`)
          } catch (e) {
            reject(e)
          }
        }
        resolve()
      })
    })
  }

  loadPolicies () {
    const self = this
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(path.join(__dirname, sourcePath('api/policies'))), async (err, files) => {
        if (err) throw err
        const pols = {}
        for (const file of files) {
          try {
            const name = file.replace('.js', '')
            const policy = require(sourcePath(`api/policies/${file}`))
            pols[name] = policy
            Log.d(TAG, `registered policy: ${name}`)
          } catch (e) {
            reject(e)
          }
        }
        for (const controller in policyTree) {
          const ctrl = controller.replace('Controller', '')
          self.policies[ctrl] = {}
          for (const action in policyTree[controller]) {
            self.policies[ctrl][action] = policyTree[controller][action].map(x => pols[x])
          }
        }
        resolve()
      })
    })
  }

  async loadMiddleware () {
    // Log.d(TAG, middleware)
    const { routed, ...rest } = middleware

    for (const item in rest) {
      Log.d(TAG, 'added middleware: ' + item)
      this.app.use(rest[item])
    }

    await this.loadPolicies()
    await this.loadRoutes()

    for (const item of routed) {
      this.app.use(item.route, item.fn)
    }
  }

  async loadHelpers () {
    global.boxes.helpers = {}
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(path.join(__dirname, sourcePath('api/helpers'))), async (err, files) => {
        if (err) throw err
        for (const file of files) {
          try {
            const name = file.replace('.js', '')
            const helper = require(sourcePath(`api/helpers/${file}`))
            global.boxes.helpers[name] = () => new Promise((resolve) => {
              resolve(helper)
            })
            Log.d(TAG, `registered helper: ${name}`)
          } catch (e) {
            reject(e)
          }
          resolve()
        }
      })
    })
  }
}
