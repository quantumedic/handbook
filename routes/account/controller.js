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
		let account = await AccountModel.findOne({email: params.email}).exec()
		console.info(account.password, md5(params.email + params.password))
		account
			? account.password === md5(params.email + params.password)
				? handler(ctx, 200, auth.generate(account))
				: handler(ctx, 30002)
			: handler(ctx, 30000)
	} else {
		handler(ctx, 201)
	}
}

const getUserInfo = async (ctx, next) => {
	let authorization = ctx.request.header.authorization

	try {
		let uid = auth.parse(authorization).uid
		let token = auth.parse(authorization).token
		if (uid) {
			let account = await AccountModel.findOne({_id: uid}).exec()
			auth.validate(account, token)
				? handler(ctx, 200, account.create_time.toLocaleString())
				: handler(ctx, 404)
		} else {
			handler(ctx, 404)
		}
	} catch (e) {
		handler(ctx, 404)
	}
}

export default {
	createNewUser,
	userLogin,
	getUserInfo
}
