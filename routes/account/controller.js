import {AccountModel, USER_BASE_INFO} from './model'
import md5 from 'md5'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'
import Account from '../../components/Account'

const createNewUser = async (ctx, next) => {
	let body = ctx.request.body

	try {
		let params = await tool.check(body, body.email && body.password && body.username, ctx)
		let accounts = await AccountModel.find({email: params.email}).exec()

		if (accounts.length <= 0 ) {
			const user = new AccountModel
			Account.init(user, params)

			let account = await user.save()
			handler(ctx, 200, Account.generate(account))
		} else {
			handler(ctx, 30001)
		}
	} catch (e) {
		console.log(e)
	}
}

const userLogin = async (ctx, next) => {
	let body = ctx.request.body

	try {
		let params = await tool.check(body, body.email && body.password, ctx)
		let account = await AccountModel.findOne({email: params.email}).exec()

		account.password === md5(params.email + params.password)
			? handler(ctx, 200, Account.generate(account))
			: handler(ctx, 30002)
	} catch (e) {
		handler(ctx, 30000)
	}
}

const getUserInfo = async (ctx, next) => {
	try {
		let user = await Account.validate(ctx)
		let account = await AccountModel.findOne({_id: user.uid}).exec()
		
		handler(ctx, 200, tool.serialize(USER_BASE_INFO, account))
	} catch (e) {
		handler(ctx, 404)
	}
}

const updateUserInfo = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let user = await Account.validate(ctx)
		let account = await AccountModel.findOne({_id: user.uid}).exec()
		

		Account.update(account, params)
		account = await account.save()

		handler(ctx, 200, tool.serialize(USER_BASE_INFO, account))
	} catch (e) {
		handler(ctx, 404)
	}
}

export default {
	createNewUser,
	userLogin,
	getUserInfo,
	updateUserInfo
}
