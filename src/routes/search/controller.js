import {Doc, FORMAT_LIST_DOC} from '../../models/doc.model'
import {Tag, FORMAT_TAG} from '../../models/tag.model'
import {User} from '../../models/user.model'
import {handler} from '../../middlewares/handler'
import format from '../../middlewares/format'

const formatDoc = docs => {
	return docs.map(doc => {
		let _doc = format.copy(doc, FORMAT_LIST_DOC, true)
		_doc.tags = _doc.tags.map(tag => {
			return format.copy(tag, FORMAT_TAG)
		})
		return _doc
	})
}

const search = async (ctx, next) => {
	let keyword = ctx.request.query.keyword
	let word_reg = new RegExp(keyword)

	try {
		let docs = await Doc.find({'title': {$regex: word_reg}}, 'title abstract tags update_time')
			.where('status').equals(1)
			.populate({path: 'tags', select: 'name level'})
			.exec()

		let tags = keyword
			? await Tag.find({'name': {$regex: word_reg}}, 'name level description').exec()
			: []
		
		let _docs = formatDoc(docs)
		let _tags = tags.map(tag => {
			return {id: tag._id, level: tag.level, name: tag.name, description: tag.description}
		})

		handler(ctx, 200, {docs: _docs, tags: _tags})
	} catch (e) {
		handler(ctx, 40003)
	}
}

const getTags = async (ctx, next) => {
	try {
		let tags = await Tag.find({'level': {$gt: 0}}, 'name level').exec()

		let _tags = tags.map(tag => {
			return format.copy(tag, FORMAT_TAG)
		})

		handler(ctx, 200, _tags)
	} catch (e) {
		console.log(e)
		handler(ctx, 50002)
	}
}

const getContributions = async (ctx, next) => {
	try {
		let docs = await Doc.find({'editors': {$in: [ctx.state.user.uid]}, 'status': {$ne: 2}})
			.populate({path: 'tags', select: 'name level'})
			.exec()

		handler(ctx, 200, formatDoc(docs))
	} catch (e) {
		handler(ctx, 40003)
	}
}

const getCollections = async (ctx, next) => {
	try {
		let user = await User.findById(ctx.state.user.uid)
			.populate({
				path: 'collections',
				select: 'title abstract tags update_time',
				populate: {
					path: 'tags',
					select: 'name level'
				},
				match: {
					'status': {$eq: 1}
				}
			})
			.exec()

		let docs = formatDoc(user.collections)

		handler(ctx, 200, docs)
	} catch (e) {
		console.log(e)
		handler(ctx, 40003)
	}
}

export default {
	search,
	getTags,
	getContributions,
	getCollections
}
