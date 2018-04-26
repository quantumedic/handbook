import {Doc, FORMAT_DOC} from '../../models/doc.model'
import {handler} from '../../middlewares/handler'
import format from '../../middlewares/format'

const formatAuthor = author => {
	return { id: author._id, username: author.username }
}

const mapDoc = async doc => {
	let _doc = await doc.populate({path: 'tags', select: '_id name level'})
		.populate({path: 'author', select: 'username'})
		.populate({path: 'editors', select: 'username'})
		.populate({path: 'last_update_author', select: 'username'})
		.execPopulate()

	return new Promise((resolve, reject) => {
		try {
			_doc = format.copy(_doc, FORMAT_DOC, true)
			_doc.author = formatAuthor(_doc.author)
			_doc.last_update_author = formatAuthor(_doc.last_update_author)
			_doc.editors = _doc.editors.map(editor => {
				return formatAuthor(editor)
			})
			_doc.tags = _doc.tags.map(tag => {
				return { id: tag._id, name: tag.name }
			})
			resolve(_doc)
		} catch (e) {
			reject(e)
		}
	})
}

const create = async (ctx, next) => {
	let params = ctx.request.body
	let time = new Date().toLocaleString()

	try {
		let doc = new Doc

		doc.create_time = time
		doc.update_time = time
		doc.draft_time = time
		doc.author = ctx.state.user.uid
		doc.editors = [ctx.state.user.uid]
		doc.tags = [params.tag_id]

		let _doc = await doc.save()

		handler(ctx, 200, _doc._id)
	} catch (e) {
		handler(ctx, 201)
	}
}

const update = async (ctx, next) => {
	let params = ctx.request.body
	let uid = ctx.state.user.uid

	try {
		let doc = await Doc.findById(params.id).exec()

		let time = new Date().toLocaleString()

		doc.title = params.title
		doc.abstract = params.abstract
		doc.reference = params.reference
		doc.draft = params.content
		doc.draft_time = time
		
		if (doc.editors.indexOf(uid) < 0) doc.editors.push(uid)
		if (params.publish) {
			doc.content = doc.draft
			doc.update_time = doc.draft_time
			doc.last_update_author = uid
			doc.status = 1
		}

		let _doc = await doc.save()
		_doc = await mapDoc(_doc)

		handler(ctx, 200, _doc)
	} catch (e) {
		console.log(e)
		handler(ctx, 201)
	}
}

const getDetail = async (ctx, next) => {
	let id = ctx.request.query.id
	let draft = ctx.request.query.draft

	try {
		let doc = await Doc.findByIdAndUpdate(id, {$inc: {view_count: 1}}).exec()
		let _doc = await mapDoc(doc)

		if (!draft) delete _doc.draft

		handler(ctx, 200, _doc)
	} catch (e) {
		console.log(e)
		handler(ctx, 40000)
	}
}

export default {
	create,
	update,
	getDetail
}
