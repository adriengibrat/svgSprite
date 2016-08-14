import cache from 'svg/cache'
import xlink from 'svg/xlink'

/**
 * Create callback that swap SVG use's xlink:href referencing external SVG sprite to point to the inlined SVG sprite
 *
 * @param {Function} before     Callback to validate / customize the SVG use's xlink:href attribute swapping
 * @return {Function}           Cache the sprite, inject it in DOM only once. For given SVG element, change the use's xlink:href to point to the inlined sprite symbol
 */
export default function inline (before) {
	return element => {
		const asset = xlink(element)
		if (asset)
			asset.replace(/^(.+?)(#(.+))$/, (_, url, hash, fragment) => {
				cache(url, sprite => {
					if (false !== before(element.ownerSVGElement, fragment, sprite, url))
						xlink(element, hash)
				})
			})
	}
}
