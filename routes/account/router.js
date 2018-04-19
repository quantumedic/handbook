import router from 'koa-router'
import AccountController from './controller'

let route = router()

route.post('/account/register', AccountController.createNewUser)

route.post('/account/login', AccountController.userLogin)

route.get('/account/info', AccountController.getUserInfo)

export default route