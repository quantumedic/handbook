import md5 from 'md5'

const validate = (account, token) => {
	let server_token = md5(account._id + account.password + account.last_login_time.toLocaleString())
	console.info(token, server_token, token === server_token)
	return token === md5(account._id + account.password + account.last_login_time.toLocaleString())
}

const generate = account => {
	let time = new Date().toLocaleString()
	console.log(time)
	account.last_login_time = time
	account.save()
	return {
		uid: account._id,
		token: md5(account._id + account.password + time.toLocaleString())
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
	generate,
	validate
}