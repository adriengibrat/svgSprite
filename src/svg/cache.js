import {noop, doc, get, wait} from 'utils'
import loaded from 'dom/loaded'
import parse from 'svg/parse'

/**
 * Cache SVG sprites and inject them in DOM
 *
 * @param {String} source           SVG sprite source (URL or markup)
 * @param {Function?} callback      Optional callback recieving the sprite SVG DOM Element injected
 * @return {Object}                 Request as stored in cache: a decorated XHR object or a simple object when markup is provided
 */
export default function cache (source, callback = noop) {
	let request = cache[source]
	if (request) {
		const cb = request.cb
		request.svg ?
			callback(request.svg) // done
			: (request.cb = svg => { cb(svg), callback(svg) }) // pending
		return request
	}
	const markup = /^\s*<svg\b/.test(source)
	const append = function (svg) {
		svg = doc.body.appendChild(parse(svg))
		svg.setAttribute('data-source', markup ? 'markup' : source)
		svg.setAttribute('display', 'none')
		request.svg = svg
		request.cb(svg)
	}
	request = markup ?
		(wait(loaded, append.bind(null, source)), {}) // wait document to be loaded
		: get(source, append) // XHR request
	request.cb = callback
	cache[source] = request
	return request
}
