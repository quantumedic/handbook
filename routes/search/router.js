import router from 'koa-router'
import SearchController from './controller'

let route = router()

route.get('/search/docs', SearchController.searchDocs)

export default route