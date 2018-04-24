import {DocModel, DOC_BASE_INFO} from './model'
import {TagModel} from '../tag/model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

const fullfilTagTree = doc => {
	const trace = tags => {
		try {
			tags.forEach(async tag => {
				let _tag = await TagModel.findOne({_id: tag}, '_id parents').exec()
				
				doc.tags = Array.from(new Set(_tag.parents.concat(doc.tags)))
				console.info(_tag, doc.tags)
				_tag.parents.length > 0
					? trace(_tag.parents)
					: doc.save()
			})
		} catch (e) {
			console.log(e)
		}
			
	}
	trace(doc.tags)
}

const mapTagList = doc => {
	let _doc = tool.serialize(DOC_BASE_INFO, doc)
	_doc.tags = _doc.tags.map(tag => {
		return { id: tag._id, name: tag.name, level: tag.level }
	})
	return _doc
}

const createNewDoc = async (ctx, next) => {
	let tag_id = ctx.request.body.tag_id

	let doc = new DocModel
	let time = new Date().toLocaleString()
	doc.create_time = time
	doc.update_time = time
	doc.draft_time = time
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
		doc.draft = params.content
		doc.reference = params.reference
		doc.draft_time = time

		if (params.publish) {
			doc.content = doc.draft
			doc.update_time = time
			doc.status = 1
		}

		let _doc = await doc.save()
		handler(ctx, 200, mapTagList(_doc))
	} catch (e) {
		handler(ctx, 40000)
	}
}

const modifyDocTag = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let doc = await DocModel.findOne({_id: params.id}).exec()
		doc.tags = params.ids.split(',')

		let _doc = await doc.save()
		let _doc_populated = await _doc.populate({path: 'tags', select: '_id name level'}).execPopulate()

		fullfilTagTree(_doc)
		handler(ctx, 200, mapTagList(_doc_populated))
	} catch (e) {
		handler(ctx, 40002)
	}
}

const getDocDetail = async (ctx, next) => {
	console.log(ctx.request.query)
	try {
		let doc = await DocModel
			.findOne({_id: ctx.request.query.id}, '-related')
			.populate({path: 'tags', select: '_id name level'})
			.exec()

		let _doc = mapTagList(doc)
		if (!ctx.request.query.preview) delete _doc.draft

		handler(ctx, 200, _doc)
	} catch (e) {
		handler(ctx, 40000)
	}
}

export default {
	createNewDoc,
	updateDoc,
	getDocDetail,
	modifyDocTag
}
