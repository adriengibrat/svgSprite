import {doc, matches} from 'utils'
import css from 'dom/css'

const animation = 'svg-insert'

// init: add svg-insert animation css rule
Array('', '-webkit-', '-moz-', '-ms-', '-o-').some(vendor => {
	try { // insertRule throws on invalid @keyframes
		return css(`@${vendor}keyframes ${animation}`, 'from { opacity: .99 } to { opacity: 1 }')
	} catch (error) {}
})

// add / remove animationstart event listener (with vendor prefixes)
function listener (action, handler) { 
	const events = ['animationstart', 'MSAnimationStart', 'webkitAnimationStart']
	for (let vendor in events)
		doc[`${action}EventListener`](events[vendor], handler)
}

/**
 * Watch specific elements insertion in DOM (using animationstart event trick)
 *
 * @param {Function} callback     Callback recieving every targeted element inserted in DOM
 * @param {String} selector       CSS selector to target specific elements
 * @return {Function}             Return the list of processed elements, stop watching if called with truthy argument
 */
export default function insert (callback, selector) {
	const rule = `animation: ${animation} 1ms !important`
	const remove = css(selector, `-webkit-${rule}; ${rule}`)
	const inserted = []
	const handler = event => {
		const target = event.target
		if (event.animationName === animation
			&& matches.call(target, selector)
			&& -1 === inserted.indexOf(target)) { // only once, even if animation start again
			inserted.push(target)
			callback(target)
		}
	}
	listener('add', handler)
	return clean => {
		if (clean) {
			remove()
			listener('remove', handler)
		}
		return inserted
	}
}
