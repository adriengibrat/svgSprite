import {string, map, find, noop} from 'utils'
import insert from 'dom/insert'
import inject from 'svg/inject'
import inline from 'svg/inline'

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
		const inserted = insert(handler, elements)
		return (clean) => map(finder, inserted(clean))
	}
	map(handler, elements)
	return () => map(finder, elements)
} 

/**
 * Target use tags pointing to external resource
 * 
 * @param {HTMLCollection|NodeList|Array|String} elements   List of elements or CSS selector
 * @return {String|Array}                                   Filtered list / modified selector to target use tag pointing to external resource
 */
function use (elements) {
	const external = 'use[*|href]:not([*|href^="#"])'
	return string(elements) ?
		`${elements} ${external}`
		: map(find.bind(null, external), elements).filter(Boolean)
}

/**
 * Inject SVGs using SVG sprite symbols
 * 
 * @param {Object} settings     Specify 'source' of the sprite. Optionally, 'elements' as CSS selector or DOM list and 'before' callback
 * @return {Function}           List processed SVG, stop processing new elements when called with truthy argument
 */
export default function svgSprite (settings) {
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
svgSprite.inline = function (settings = {}) {
	return call(
		inline(settings.before || noop)
		, use(settings.elements || 'svg')
		, element => element.ownerSVGElement
	)
}
