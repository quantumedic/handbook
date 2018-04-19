import {AccountModel} from './model'
import md5 from 'md5'
import auth from '../../utils/authorization'
import {handler} from '../../utils/handler'

const createNewUser = async (ctx, next) => {
	let params = ctx.request.body

	if (params.email && params.password && params.username) {
		let accounts = await AccountModel.find({email: params.email}).exec()

		if (accounts.length <= 0 ) {
			const user = new AccountModel
			user.email = params.email
			user.username = params.username
			user.password = md5(params.email + params.password)
			user.create_time = new Date()
			user.type = 'reader'
			let account = await user.save()
			handler(ctx, 200, auth.generate(account))
		} else {
			handler(ctx, 30001)
		}
	} else {
		handler(ctx, 201)
	}
}

const userLogin = async (ctx, next) => {
	let params = ctx.request.body

	if (params.email && params.password) {
		try {
			let account = await AccountModel.findOne({email: params.email}).exec()
			account.password === md5(params.email + params.password)
				? handler(ctx, 200, auth.generate(account))
				: handler(ctx, 30002)
		} catch (e) {
			handler(ctx, 30000)
		}
	} else {
		handler(ctx, 201)
	}
}

const getUserInfo = async (ctx, next) => {
	try {
		let uid = await auth.validate(ctx)
		let account = await AccountModel.findOne({_id: uid}, '-password -__v').exec()
		handler(ctx, 200, account)
	} catch (e) {
		handler(ctx, 404)
	}
}

export default {
	createNewUser,
	userLogin,
	getUserInfo
}
