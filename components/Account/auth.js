import {AccountModel} from '../../routes/account/model'
import md5 from 'md5'

export const validate = ctx => {
	let authorization = ctx.request.header.authorization

	const checkUser = async (resolve, reject, uid, token) => {
		try {
			let account = await AccountModel.findOne({_id: uid}, '_id type password last_login_time').exec()

			token === md5(account._id + account.password + account.last_login_time.toLocaleString())
				? resolve({uid: uid, type: account.type})
				: reject(false)
		} catch (e) {
			reject(e)
		}
	}

	return new Promise((resolve, reject) => {
		try {
			let uid = parse(authorization).uid
			let token = parse(authorization).token

			if (uid) {
				checkUser(resolve, reject, uid, token)
			} else {
				reject(false)
			}
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}

export const generate = account => {
	let time = new Date().toLocaleString()
	account.last_login_time = time
	account.save()
	return {
		uid: account._id,
		token: md5(account._id + account.password + time.toLocaleString())
	}
}

export const parse = auth => {
	let auth_list = auth.split(';')
	let result = {}
	auth_list.forEach(item => {
		let item_props = item.split('=')
		result[item_props[0]] = item_props[1]
	})
	return result
}
