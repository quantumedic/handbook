import router from 'koa-router'
import Controller from './controller'

let route = router()

route.get('/search/docs', Controller.search)

route.get('/search/tags', Controller.getTags)

export default route