module.exports = class HttpError extends Error {
  constructor (status, str, hint) {
    super(str)
    this.status = status || 500
    this.hint = hint
  }

  toString () {
    return `${this.status}: ${this.message}`
  }

  http (res) {
    return res.json({
      status: this.status,
      message: this.message,
      hint: this.hint ? this.hint : undefined
    }).status(this.status)
  }
}
