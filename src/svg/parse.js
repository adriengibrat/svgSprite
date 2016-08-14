import {doc} from 'utils'

const dom = doc.createElement('div')

/**
 * Parse SVG source
 *
 * @param {Document|String} source      SVG source (usually returned by XHR as XMLDocument or markup source text)
 * @throws {Error}                      When source can't be parsed
 * @return {Element}                    Parsed SVG DOM Element
 */
export default function parse (source) {
	const svg = source.documentElement || ((dom.innerHTML = String(source).trim()), dom.firstChild)
	if (!/svg/i.test(svg.nodeName))
		throw Error(`Not a svg ${source}`)
	return svg
}
