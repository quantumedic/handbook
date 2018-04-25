import router from 'koa-router'
import TagController from './controller'

let route = router()

route.post('/tag', TagController.createNewTag)

route.get('/tag', TagController.getTagInfo)

route.get('/tag/list', TagController.getTagList)

route.put('/tag/favor', TagController.favorTag)

export default route