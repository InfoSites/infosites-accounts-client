import jwtDecode from 'jwt-decode'

export default function( params ) {
	var _addAttribute = function( ele, attrName, attrValue ) {
		try {
			var attr = document.createAttribute( attrName )
			attr.nodeValue = attrValue
			ele.setAttributeNode( attr )
		} catch( ex ) {}
	}
	
	let iframeId = `iframe-infosites-accounts-${params.appId}`
		
	let iframe = document.getElementById(iframeId)
	if (!iframe) {
		iframe = document.createElement ( "IFRAME" );
		_addAttribute( iframe, 'id', iframeId );
		_addAttribute( iframe, 'frameBorder', 0 );
		_addAttribute( iframe, 'style', 'position: absolute; bottom: 0; right: 0; width: 0; height: 0;' );
		document.body.appendChild( iframe );
	}

	iframe.src = `${params.url}/login/#/token?app=${params.appId}&source=${window.location.href}`

	let exports = {}

	exports.getToken = function () {
	  return new Promise((resolve, reject) => {
		let listener = function (event) {
		  if (!event.data || typeof event.data !== 'string') return
		  let chunk = event.data.split('--')
          if (chunk[0] === 'token') resolve(chunk[1])
          if (chunk[0] === 'redirect') reject(chunk[1])
          window.removeEventListener('message', listener)
		}
		window.addEventListener('message', listener)
		iframe.contentWindow.postMessage('token', '*')
	  })
	}

	exports.decodeUser = function (token) {
	  let decoded = jwtDecode(token)
	  return {id: decoded.sub, email: decoded.email}
	}

	exports.getUser = function () {
	  return new Promise((resolve, reject) => {
		exports.getToken().then(function (token) {
		  resolve(exports.decodeUser(token))
		}, function (err) {
		  reject(err)
		})
	  })
	}

	exports.logout = function () {
	  return new Promise((resolve, reject) => {
		let listener = function (event) {
		  resolve()
		  window.removeEventListener('message', listener)
		}
		window.addEventListener('message', listener)
		iframe.contentWindow.postMessage('logout', '*')
	  })
	}
	
	return exports;
}
