(function (layer) {
  const cart = layer.config
  if (!cart) throw new Error('missing chainLayer.config')

  let url
  const loc = window.location
  if (loc.hostname === 'villa7.github.io') {
    url = 'http://localhost:3001'
  } else {
    url = `${loc.protocol}//api.${loc.host}`
  }

  const head = document.querySelector('head')
  const appScript = document.createElement('script')
  appScript.src = url + '/cc/app?id=' + cart
  head.appendChild(appScript)

  const appStyle = document.createElement('link')
  appStyle.setAttribute('rel', 'stylesheet')
  appStyle.setAttribute('href', url + '/cc/css?id=' + cart)
  head.appendChild(appStyle)

  const customColor = document.createElement('link')
  customColor.setAttribute('rel', 'stylesheet')
  customColor.setAttribute('href', url + '/cc/custom-colors?id=' + cart)
  head.appendChild(customColor)

  const customDirection = document.createElement('link')
  customDirection.setAttribute('rel', 'stylesheet')
  customDirection.setAttribute('href', url + '/cc/custom-direction?id=' + cart)
  head.appendChild(customDirection)

  const customStyle = document.createElement('link')
  customStyle.setAttribute('rel', 'stylesheet')
  customStyle.setAttribute('href', url + '/cc/custom-style?id=' + cart)
  head.appendChild(customStyle)

  const stripeScript = document.createElement('script')
  stripeScript.src = 'https://js.stripe.com/v3/'
  stripeScript.setAttribute('async', true)
  head.appendChild(stripeScript)

  const body = document.querySelector('body')
  const cartContainer = document.createElement('div')
  cartContainer.setAttribute('id', 'chaincart-container')
  body.appendChild(cartContainer)

})(window.chainLayer)
