import {DocModel, DOC_BASE_INFO} from './model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'
import Account from '../../components/Account'
import Document from '../../components/Document'

const createNewDoc = async (ctx, next) => {
	let tag_id = ctx.request.body.tag_id

	try {
		let user = await Account.validate(ctx)

		if (user.type === 'editor') {
			let doc = new DocModel
			Document.init(doc, tag_id)
			let _doc = await doc.save()
			Document.fullfil(_doc)

			handler(ctx, 200, tool.serialize(DOC_BASE_INFO, _doc))
		} else {
			handler(ctx, 203)
		}
	} catch (e) {
		handler(ctx, 40001)
	}
}

const updateDoc = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let doc = await DocModel.findOne({_id: params.id}).exec()
		Document.update(doc, params)

		let _doc = await doc.save()
		_doc = await _doc.populate({path: 'tags', select: '_id name level'}).execPopulate()

		handler(ctx, 200, Document.tagify(tool.serialize(DOC_BASE_INFO, _doc)))
	} catch (e) {
		console.log(e)
		handler(ctx, 40000)
	}
}

const modifyDocTag = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let doc = await DocModel.findOne({_id: params.id}).exec()
		doc.tags = params.ids.split(',')

		let _doc = await doc.save()
		_doc = await _doc.populate({path: 'tags', select: '_id name level'}).execPopulate()
		Document.fullfil(_doc)

		handler(ctx, 200, Document.tagify(tool.serialize(DOC_BASE_INFO, _doc)))
	} catch (e) {
		handler(ctx, 40002)
	}
}

const getDocDetail = async (ctx, next) => {
	try {
		let doc = await DocModel
			.findOne({_id: ctx.request.query.id})
			.populate({path: 'tags', select: '_id name level'})
			.exec()

		let _doc = tool.serialize(DOC_BASE_INFO, doc)
		Document.tagify(_doc)
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
