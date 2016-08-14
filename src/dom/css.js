import {doc} from 'utils'

const sheet = doc.head.appendChild(doc.createElement('style')).sheet // inject a styleseet in the document

/**
 * Inject CSS rules
 *
 * @param {String} selector     CSS selector
 * @param {String} properties   CSS rule body properties
 * @return {Function}           Remove the inserted CSS rule
 */
export default function css (selector, properties) {
	// see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule#Restrictions
	const index = sheet.insertRule(`${selector} { ${properties} }`, sheet.cssRules.length)
	return () => (sheet.deleteRule(index), sheet.insertRule('x{}', index))
}
