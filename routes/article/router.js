import router from 'koa-router'
import ArticleController from './controller'

let route = router()

route.post('/article', ArticleController.createNewArticle)

route.put('/article', ArticleController.updateArticle)

route.get('/article', ArticleController.getArticleDetail)

export default route