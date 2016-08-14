import {dataset, find} from 'utils'
import cache from 'svg/cache'
import parse from 'svg/parse'
import xlink from 'svg/xlink'

/**
 * Create callback that append to given DOM element a SVG pointing to an inlined SVG sprite
 *
 * @param {Function} before     Callback to validate / customize the injected SVG
 * @param {String} source       SVG sprite source
 * @return {Function}           Cache the sprite, inject it in DOM only once. In given element, append a SVG pointing to one of the sprite symbol
 */
export default function inject (before, source) {
	return element => {
		cache(source, sprite => {
			const fragment = dataset('svg', element)
			const svg = parse(`<svg role="presentation"><use xlink:href="#${fragment}"/></svg>`)
			if (false !== before(svg, fragment, xlink.bind(null, find('use', svg)), element, sprite, source))
				element.appendChild(svg)
		})
	}
}
