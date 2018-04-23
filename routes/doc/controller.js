import {DocModel, DOC_BASE_INFO} from './model'
import {TagModel} from '../tag/model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

const fullfilTagTree = doc => {
	const trace = tags => {
		try {
			tags.forEach(async id => {
				let tag = await TagModel.findOne({_id: id}, '_id parents').exec()
				doc.tags = Array.from(new Set(tag.parents.concat(doc.tags)))
				tag.parents.length > 0
					? trace(tag.parents)
					: doc.save()
			})
		} catch (e) {
			console.log(e)
		}
			
	}
	trace(doc.tags)
}

const createNewDoc = async (ctx, next) => {
	let tag_id = ctx.request.body.tag_id

	let doc = new DocModel
	let time = new Date().toLocaleString()
	doc.create_time = time
	doc.update_time = time
	doc.tags = [tag_id]

	let _doc = await doc.save()
	fullfilTagTree(_doc)
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
		let doc = await DocModel
			.findOne({_id: ctx.query.id}, '-related')
			.populate({path: 'tags', select: '_id name'})
			.exec()
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
