import {doc} from 'utils'

/**
 * Is the document loaded ?
 *
 * @return {Boolean}
 */
export default function loaded () {
	return /interactive|complete/.test(doc.readyState)
}
