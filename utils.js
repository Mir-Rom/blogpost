import { SUCCESS_CODE } from './constants.js'
export function createResponse(data, code = SUCCESS_CODE) {
	return { data, code }
}
