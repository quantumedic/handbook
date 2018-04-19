import router from 'koa-router'
import AccountController from './controller'

let route = router()

route.get('/account/info', AccountController.getUserInfo)

route.post('/account/register', AccountController.createNewUser)

route.post('/account/login', AccountController.userLogin)

export default route