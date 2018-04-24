import router from 'koa-router'
import TagController from './controller'

let route = router()

route.post('/tag', TagController.createNewTag)

route.get('/tag', TagController.getTagInfo)

route.get('/tag/list', TagController.getTagList)

export default route