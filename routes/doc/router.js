import router from 'koa-router'
import DocController from './controller'

let route = router()

route.post('/doc', DocController.createNewDoc)

route.put('/doc', DocController.updateDoc)

route.get('/doc', DocController.getDocDetail)

export default route