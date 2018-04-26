import md5 from 'md5'
import {User, FORMAT_USER} from '../../models/user.model'
import {handler} from '../../middlewares/handler'
import auth from '../../middlewares/auth'
import format from '../../middlewares/format'

const register = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let users = await User.find({email: params.email}).exec()

		if (users.length <= 0 ) {
			let user = new User
			user.email = params.email
			user.username = params.username
			user.password = md5(params.email + params.password)
			user.create_time = new Date().toLocaleString()

			let _user = await user.save()
			handler(ctx, 200, auth.generate(_user))
		} else {
			handler(ctx, 30001)
		}
	} catch (e) {
		handler(ctx, 201)
	}
}

const getInfo = async (ctx, next) => {
	try  {
		let user = await User.findById(ctx.state.user.uid).exec()

		handler(ctx, 200, format.copy(user, FORMAT_USER, true))
	} catch (e) {
		handler(ctx, 30003)
	}
}

const login = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let user = await User.findOne({email: params.email}).exec()

		user.password === md5(params.email + params.password)
			? handler(ctx, 200, auth.generate(user))
			: handler(ctx, 3002)
	} catch (e) {
		handler(ctx, 30000)
	}
}

const modify = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let user = await User.findById(ctx.state.user.uid).exec()

		FORMAT_USER.forEach(prop => {
			if (params[prop]) user[prop] = params[prop]
		})

		if (user.phone && user.credential_number && user.realname) user.type = 'editor'

		let _user = await user.save()
		handler(ctx, 200, format.copy(_user, FORMAT_USER, true))
	} catch (e) {
		handler(ctx, 30004)
	}
}

export default {
	register,
	getInfo,
	login,
	modify
}
