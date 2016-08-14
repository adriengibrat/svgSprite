/**
 * Getter / setter of xlink attibute
 *
 * @param {Element} element     DOM Element
 * @param {String?} href        Optional for getter, a href link for setter
 * @return {String|null}        Attribute value when called as getter / void when setter
 */
export default function xlink (element, href) {
	return element[`${href ? 'set' : 'get'}AttributeNS`]('http://www.w3.org/1999/xlink', 'href', href)
}
