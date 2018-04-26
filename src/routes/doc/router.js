import router from 'koa-router'
import Controller from './controller'

let route = router()

route.post('/doc', Controller.create)

route.put('/doc', Controller.update)

route.get('/doc', Controller.getDetail)

export default route