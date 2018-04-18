const parse = auth => {
	let auth_list = auth.split(';')
	let result = {}
	auth_list.forEach(item => {
		let item_props = item.split('=')
		result[item_props[0]] = item_props[1]
	})
	return result
}

export default {
	parse
}