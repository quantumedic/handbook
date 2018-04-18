import router from 'koa-router'
import AccountController from './controller'

let route = router()

route.get('/account/info', async (ctx, next) => {
	ctx.body = {
		code: '200',
		msg: 'ok',
		result: await AccountController.getUserInfo(ctx.request.header.authorization)
	}
})

route.post('/account/register', async (ctx, next) => {
	ctx.body = {
		code: '200',
		msg: 'ok',
		result: await AccountController.createNewUser(ctx.request.body)
	}
})

route.post('/account/login', async (ctx, next) => {
	ctx.body = {
		code: '200',
		msg: 'ok',
		result: await AccountController.userLogin(ctx.request.body)
	}
})

export default route