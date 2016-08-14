// do nothing
export function noop () {}

// map array-like lists
export function map (mapper, list) { return [].map.call(list, mapper) }

// is string utility
export function string (x) { return 'string' === typeof x }

// minification purpose
export const doc = document

// matches polyfill
export const matches = Element.prototype.matches
	|| function (selector) { return -1 !== [].indexOf.call(doc.querySelectorAll(selector), this) }

// query selector helper
export function find (selector, element) {
	return element ? element.querySelector(selector) : null
}

// data-attr dataset read even when no support (IE10)
export function dataset (name, element) {
	return element.dataset ?
		element.dataset[name]
		: element.getAttribute('data-' + name.replace(/[A-Z]/, uppercase => `-${uppercase.toLowerCase()}`))
}

// simple XHR get
export function get (url, callback) {
	const request = new XMLHttpRequest
	request.onreadystatechange = () => {
		const status = 4 === request.readyState && request.status
		if (200 > status)
			return
		if (!status || 400 <= status)
			throw Error(`${status} ${request.statusText} ${url}`)
		callback(request.responseXML || request.responseText)
	}
	request.open('GET', url)
	request.send()
	return request
}

// raf wrapper / polyfill
const w = window
const raf = w.requestAnimationFrame
export const async = raf || (callback => setTimeout(callback, 16))
async.cancel = raf ? w.cancelAnimationFrame : clearTimeout

// wait predicate to be true before calling callback (use polling)
export function wait (predicate, callback) {
	async(predicate() ? callback : () => wait(predicate, callback))
}
