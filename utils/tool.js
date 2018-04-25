import {handler} from './handler'

const serialize = (model, item) => {
	let result = {}
	for (let prop in model) {
		if (prop.search('id') >= 0) {
			result[prop] = item._id
		} else if (prop.search('time') >= 0) {
			result[prop] = item[prop].toLocaleString()
		} else if (prop) {
			result[prop] = item[prop]
		}
	}
	return result
}

const check = (params, condition, ctx) => {
	return new Promise((resolve, reject) => {
		if (condition) {
			resolve(params)
		} else {
			handler(ctx, 201)
			reject(condition)
		}
	})
}

export default {
	serialize,
	check
}
