import router from 'koa-router'
import ArticleController from './controller'

let route = router()

route.get('/article', async (ctx, next) => {
	try {
		ctx.body = {
			code: '200',
			msg: 'ok',
			result: await ArticleController.getArticleDetail(ctx.request.query)
		}
	} catch (err){
		ctx.body = {
			code: '201',
			msg: 'account invalid',
			result: ''
		}
	}
})

export default route