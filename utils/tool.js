const serialize = (model, item) => {
	let result = {}
	for (let prop in model) {
		console.info(prop, item[prop])
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

export default {
	serialize
}
