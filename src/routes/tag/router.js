import router from 'koa-router'
import Controller from './controller'

let route = router()

route.post('/tag', Controller.create)

route.put('/tag/favor', Controller.favor)

route.get('/tag', Controller.getInfo)

route.get('/tag/list', Controller.getList)

route.get('/tag/docs', Controller.searchDocsByTag)

export default route