import md5 from 'md5'

const generate = account => {
	let time = new Date()
	return {
		uid: account._id,
		token: md5(account._id + account.password + time.toString())
	}
}

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
	parse,
	generate
}