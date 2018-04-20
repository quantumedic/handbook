import {ArticleModel} from './model'

const getArticleDetail = query => ArticleModel.findOne({_id: query.id})

export default {
	getArticleDetail
}
