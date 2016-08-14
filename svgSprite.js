(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('svgSprite', factory) :
	(global.svgSprite = factory());
}(this, function () { 'use strict';

	/**
	 * svgSprite 1.2.0 – Inline SVG icons FTW
	 * Made with ♫·♪ & -♥- by Adrien Gibrat <adrien.gibrat@gmail.com>
	 * Published under (WTFPL OR MIT) License
	 */

	// do nothing
	function noop () {}

	// map array-like lists
	function map (mapper, list) { return [].map.call(list, mapper) }

	// is string utility
	function string (x) { return 'string' === typeof x }

	// minification purpose
	var doc = document

	// matches polyfill
	var matches = Element.prototype.matches
		|| function (selector) { return -1 !== [].indexOf.call(doc.querySelectorAll(selector), this) }

	// query selector helper
	function find (selector, element) {
		return element ? element.querySelector(selector) : null
	}

	// data-attr dataset read even when no support (IE10)
	function dataset (name, element) {
		return element.dataset ?
			element.dataset[name]
			: element.getAttribute('data-' + name.replace(/[A-Z]/, function (uppercase) { return ("-" + (uppercase.toLowerCase())); }))
	}

	// simple XHR get
	function get (url, callback) {
		var request = new XMLHttpRequest
		request.onreadystatechange = function () {
			var status = 4 === request.readyState && request.status
			if (200 > status)
				return
			if (!status || 400 <= status)
				throw Error((status + " " + (request.statusText) + " " + url))
			callback(request.responseXML || request.responseText)
		}
		request.open('GET', url)
		request.send()
		return request
	}

	// raf wrapper / polyfill
	var w = window
	var raf = w.requestAnimationFrame
	var async = raf || (function (callback) { return setTimeout(callback, 16); })
	async.cancel = raf ? w.cancelAnimationFrame : clearTimeout

	// wait predicate to be true before calling callback (use polling)
	function wait (predicate, callback) {
		async(predicate() ? callback : function () { return wait(predicate, callback); })
	}

	var sheet = doc.head.appendChild(doc.createElement('style')).sheet // inject a styleseet in the document

	/**
	 * Inject CSS rules
	 *
	 * @param {String} selector     CSS selector
	 * @param {String} properties   CSS rule body properties
	 * @return {Function}           Remove the inserted CSS rule
	 */
	function css (selector, properties) {
		// see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule#Restrictions
		var index = sheet.insertRule((selector + " { " + properties + " }"), sheet.cssRules.length)
		return function () { return (sheet.deleteRule(index), sheet.insertRule('x{}', index)); }
	}

	var animation = 'svg-insert'

	// init: add svg-insert animation css rule
	Array('', '-webkit-', '-moz-', '-ms-', '-o-').some(function (vendor) {
		try { // insertRule throws on invalid @keyframes
			return css(("@" + vendor + "keyframes " + animation), 'from { opacity: .99 } to { opacity: 1 }')
		} catch (error) {}
	})

	// add / remove animationstart event listener (with vendor prefixes)
	function listener (action, handler) { 
		var events = ['animationstart', 'MSAnimationStart', 'webkitAnimationStart']
		for (var vendor in events)
			doc[(action + "EventListener")](events[vendor], handler)
	}

	/**
	 * Watch specific elements insertion in DOM (using animationstart event trick)
	 *
	 * @param {Function} callback     Callback recieving every targeted element inserted in DOM
	 * @param {String} selector       CSS selector to target specific elements
	 * @return {Function}             Return the list of processed elements, stop watching if called with truthy argument
	 */
	function insert (callback, selector) {
		var rule = "animation: " + animation + " 1ms !important"
		var remove = css(selector, ("-webkit-" + rule + "; " + rule))
		var inserted = []
		var handler = function (event) {
			var target = event.target
			if (event.animationName === animation
				&& matches.call(target, selector)
				&& -1 === inserted.indexOf(target)) { // only once, even if animation start again
				inserted.push(target)
				callback(target)
			}
		}
		listener('add', handler)
		return function (clean) {
			if (clean) {
				remove()
				listener('remove', handler)
			}
			return inserted
		}
	}

	/**
	 * Is the document loaded ?
	 *
	 * @return {Boolean}
	 */
	function loaded () {
		return /interactive|complete/.test(doc.readyState)
	}

	var dom = doc.createElement('div')

	/**
	 * Parse SVG source
	 *
	 * @param {Document|String} source      SVG source (usually returned by XHR as XMLDocument or markup source text)
	 * @throws {Error}                      When source can't be parsed
	 * @return {Element}                    Parsed SVG DOM Element
	 */
	function parse (source) {
		var svg = source.documentElement || ((dom.innerHTML = String(source).trim()), dom.firstChild)
		if (!/svg/i.test(svg.nodeName))
			throw Error(("Not a svg " + source))
		return svg
	}

	/**
	 * Cache SVG sprites and inject them in DOM
	 *
	 * @param {String} source           SVG sprite source (URL or markup)
	 * @param {Function?} callback      Optional callback recieving the sprite SVG DOM Element injected
	 * @return {Object}                 Request as stored in cache: a decorated XHR object or a simple object when markup is provided
	 */
	function cache (source, callback) {
		if ( callback === void 0 ) callback = noop;

		var request = cache[source]
		if (request) {
			var cb = request.cb
			request.svg ?
				callback(request.svg) // done
				: (request.cb = function (svg) { cb(svg), callback(svg) }) // pending
			return request
		}
		var markup = /^\s*<svg\b/.test(source)
		var append = function (svg) {
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

	/**
	 * Getter / setter of xlink attibute
	 *
	 * @param {Element} element     DOM Element
	 * @param {String?} href        Optional for getter, a href link for setter
	 * @return {String|null}        Attribute value when called as getter / void when setter
	 */
	function xlink (element, href) {
		return element[((href ? 'set' : 'get') + "AttributeNS")]('http://www.w3.org/1999/xlink', 'href', href)
	}

	/**
	 * Create callback that append to given DOM element a SVG pointing to an inlined SVG sprite
	 *
	 * @param {Function} before     Callback to validate / customize the injected SVG
	 * @param {String} source       SVG sprite source
	 * @return {Function}           Cache the sprite, inject it in DOM only once. In given element, append a SVG pointing to one of the sprite symbol
	 */
	function inject (before, source) {
		return function (element) {
			cache(source, function (sprite) {
				var fragment = dataset('svg', element)
				var svg = parse(("<svg role=\"presentation\"><use xlink:href=\"#" + fragment + "\"/></svg>"))
				if (false !== before(svg, fragment, xlink.bind(null, find('use', svg)), element, sprite, source))
					element.appendChild(svg)
			})
		}
	}

	/**
	 * Create callback that swap SVG use's xlink:href referencing external SVG sprite to point to the inlined SVG sprite
	 *
	 * @param {Function} before     Callback to validate / customize the SVG use's xlink:href attribute swapping
	 * @return {Function}           Cache the sprite, inject it in DOM only once. For given SVG element, change the use's xlink:href to point to the inlined sprite symbol
	 */
	function inline (before) {
		return function (element) {
			var asset = xlink(element)
			if (asset)
				asset.replace(/^(.+?)(#(.+))$/, function (_, url, hash, fragment) {
					cache(url, function (sprite) {
						if (false !== before(element.ownerSVGElement, fragment, sprite, url))
							xlink(element, hash)
					})
				})
		}
	}

	/**
	 * Apply the handler to every elements
	 *
	 * @param {Function} handler                                How to process each element
	 * @param {HTMLCollection|NodeList|Array|String} elements   List of elements or CSS selector
	 * @param {Function} finder                                 Find SVG Element relative to processed element
	 * @return {Function}                                       Return the list of processed elements. If 'elements' is a selector stop processing new elements if called with truthy argument
	 */
	function call (handler, elements, finder) {
		if (string(elements)) {
			var inserted = insert(handler, elements)
			return function (clean) { return map(finder, inserted(clean)); }
		}
		map(handler, elements)
		return function () { return map(finder, elements); }
	} 

	/**
	 * Target use tags pointing to external resource
	 * 
	 * @param {HTMLCollection|NodeList|Array|String} elements   List of elements or CSS selector
	 * @return {String|Array}                                   Filtered list / modified selector to target use tag pointing to external resource
	 */
	function use (elements) {
		var external = 'use[*|href]:not([*|href^="#"])'
		return string(elements) ?
			(elements + " " + external)
			: map(find.bind(null, external), elements).filter(Boolean)
	}

	/**
	 * Inject SVGs using SVG sprite symbols
	 * 
	 * @param {Object} settings     Specify 'source' of the sprite. Optionally, 'elements' as CSS selector or DOM list and 'before' callback
	 * @return {Function}           List processed SVG, stop processing new elements when called with truthy argument
	 */
	function svgSprite (settings) {
		return call(
			inject(settings.before || noop, settings.source)
			, settings.elements || '[data-svg]'
			, find.bind(null, 'svg')
		)
	}

	/**
	 * Inline SVGs pointing to external resources
	 *
	 * @param {Object?} settings    Optional, 'elements' as CSS selector or DOM list and 'before' callback
	 * @return {Function}           List processed SVG, stop processing new elements when called with truthy argument
	 */
	svgSprite.inline = function (settings) {
		if ( settings === void 0 ) settings = {};

		return call(
			inline(settings.before || noop)
			, use(settings.elements || 'svg')
			, function (element) { return element.ownerSVGElement; }
		)
	}

	return svgSprite;

}));
//# sourceMappingURL=svgSprite.js.map
