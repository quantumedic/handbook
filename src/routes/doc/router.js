import router from 'koa-router'
import Controller from './controller'

let route = router()

route.post('/doc', Controller.create)

route.put('/doc', Controller.update)

route.delete('/doc', Controller.remove)

route.put('/doc/collect', Controller.collect)

route.delete('/doc/collect', Controller.uncollect)

route.get('/doc', Controller.getDetail)

export default route