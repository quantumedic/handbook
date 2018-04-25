import moment from 'moment'
import {DocModel} from '../doc/model'
import {handler} from '../../utils/handler'

moment.locale('zh-CN')

const searchDocs = async (ctx, next) => {
	try {
		let docs = await DocModel.find({}, '_id title abstract tags update_time')
			.where('status').equals(1)
			.populate({path: 'tags', select: '_id name'})
			.exec()

		docs = docs.map(doc => {
			return {
				id: doc._id,
				title: doc.title,
				abstract: doc.abstract,
				update_time: moment(doc.update_time).fromNow(),
				tags: doc.tags.map(tag => {
					return { id: tag._id, name: tag.name }
				})
			}
		})

		handler(ctx, 200, docs)
	} catch (e) {
		handler(ctx, 40003)
	}
}

export default {
	searchDocs
}
