import {DocModel, DOC_BASE_INFO} from './model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

const createNewDoc = async (ctx, next) => {
	let doc = new DocModel
	let time = new Date().toLocaleString()
	doc.create_time = time
	doc.update_time = time

	let _doc = await doc.save()
	handler(ctx, 200, tool.serialize(DOC_BASE_INFO, _doc))
}

const updateDoc = async (ctx, next) => {
	let params = ctx.request.body
	let time = new Date().toLocaleString()

	try {
		let doc = await DocModel.findOne({_id: params.id}).exec()
		doc.title = params.title
		doc.abstract = params.abstract
		doc.content = params.content
		doc.reference = params.reference
		doc.update_time = time

		let _doc = await doc.save()
		handler(ctx, 200, tool.serialize(DOC_BASE_INFO, _doc))
	} catch (e) {
		handler(ctx, 40000)
	}
}

const getDocDetail = async (ctx, next) => {
	try {
		let doc = await DocModel.findOne({_id: ctx.query.id}).exec()
		handler(ctx, 200, tool.serialize(DOC_BASE_INFO, doc))
	} catch (e) {
		handler(ctx, 40000)
	}
}



export default {
	createNewDoc,
	updateDoc,
	getDocDetail
}
