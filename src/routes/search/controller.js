import {Doc, FORMAT_LIST_DOC} from '../../models/doc.model'
import {Tag, FORMAT_TAG} from '../../models/tag.model'
import {handler} from '../../middlewares/handler'
import format from '../../middlewares/format'

const search = async (ctx, next) => {
	try {
		let docs = await Doc.find({}, 'title abstract tags update_time')
			.where('status').equals(1)
			.populate({path: 'tags', select: 'name'})
			.exec()

		docs = docs.map(doc => {
			let _doc = format.copy(doc, FORMAT_LIST_DOC, true)
			_doc.tags = _doc.tags.map(tag => {
				return format.copy(tag, FORMAT_TAG)
			})
			return _doc
		})

		handler(ctx, 200, docs)
	} catch (e) {
		handler(ctx, 40003)
	}
}

const getTags = async (ctx, next) => {
	try {
		let tags = await Tag.find({}, 'name level').exec()

		tags = tags.map(tag => {
			return format.copy(tag, FORMAT_TAG)
		})

		handler(ctx, 200, tags)
	} catch (e) {
		handler(ctx, 50002)
	}
}

export default {
	search,
	getTags
}
