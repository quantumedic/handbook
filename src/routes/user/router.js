import router from 'koa-router'
import Controller from './controller'

let route = router()

route.post('/account/register', Controller.register)

route.post('/account/login', Controller.login)

route.post('/account/logout', Controller.logout)

route.get('/account/info', Controller.getInfo)

route.put('/account/info', Controller.modify)

export default route