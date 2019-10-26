/* global Log */
const TAG = 'StoreController'

module.exports = {
  create: async (req, res, next) => {
    Log.d(TAG, req.body)
    Log.d(TAG, req.user)
  }
}
