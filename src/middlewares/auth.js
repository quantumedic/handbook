import {User} from '../models/user.model'
import {handler} from './handler'
import permission from './permission'
import md5 from 'md5'

const equal = (token, account) => {
	console.info(token, account)
	return account.tokens.indexOf(token) >= 0
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

const authenticate = async (ctx, next) => {
	let authorization = ctx.request.header.authorization
	let method = ctx.method
	let path = ctx.path

	try {
		let user = authorization ? parse(authorization) : {}
		ctx.state.user = user
		console.info(method, path)
		
		// authenticate token
		if (permission.check(method, path)) {
			await next()
		} else {
			let _user = await User.findById(user.uid).exec()

			if (equal(user.token, _user)) {
				permission.permit(method, path)
					? _user.type === 'editor' || _user.type === 'admin' ? await next() : handler(ctx, 203)
					: await next()
			} else {
				handler(ctx, 404)
			}
		}
	} catch (e) {
		console.log(e)
		handler(ctx, 204)
	}
}

const generate = async user => {
	return new Promise((resolve, reject) => {
		try {
			let time = new Date().toLocaleString()
			let token = md5(user._id + user.password + time.toLocaleString())
			user.last_login_time = time

			user.tokens
				? user.tokens.push(token)
				: user.tokens = [token]

			user.save().then(res => {
				resolve({
					uid: user._id,
					token: token
				})
			}, err => {
				reject(err)
			})
		} catch (e) {
			reject(e)
		}
	})
}

export default {
	authenticate,
	generate
}
