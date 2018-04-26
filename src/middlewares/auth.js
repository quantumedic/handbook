import {User} from '../models/user.model'
import {handler} from './handler'
import permission from './permission'
import md5 from 'md5'

const equal = (token, account) => {
	return token === md5(account._id + account.password + account.last_login_time.toLocaleString())
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
		handler(ctx, 404)
	}
}

const generate = user => {
	let time = new Date().toLocaleString()
	user.last_login_time = time
	user.save()
	return {
		uid: user._id,
		token: md5(user._id + user.password + time.toLocaleString())
	}
}

export default {
	authenticate,
	generate
}
