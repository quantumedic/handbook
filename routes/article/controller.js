import {ArticleModel, ARTICLE_BASE_INFO} from './model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

const createNewArticle = async (ctx, next) => {
	let article = new ArticleModel
	let time = new Date().toLocaleString()
	article.create_time = time
	article.update_time = time

	let _article = await article.save()
	handler(ctx, 200, tool.serialize(ARTICLE_BASE_INFO, _article))
}

const updateArticle = async (ctx, next) => {
	let params = ctx.request.body
	let time = new Date().toLocaleString()

	try {
		let article = await ArticleModel.findOne({_id: params.id}).exec()
		article.title = params.title
		article.abstract = params.abstract
		article.content = params.content
		article.reference = params.reference
		article.update_time = time

		let _article = await article.save()
		handler(ctx, 200, tool.serialize(ARTICLE_BASE_INFO, _article))
	} catch (e) {
		handler(ctx, 40000)
	}
}

const getArticleDetail = async (ctx, next) => {
	try {
		let article = await ArticleModel.findOne({_id: ctx.query.id}).exec()
		handler(ctx, 200, tool.serialize(ARTICLE_BASE_INFO, article))
	} catch (e) {
		handler(ctx, 40000)
	}
}



export default {
	createNewArticle,
	updateArticle,
	getArticleDetail
}
