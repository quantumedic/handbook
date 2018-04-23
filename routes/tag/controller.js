import {TagModel, TAG_BASE_INFO} from './model'
import {DocModel} from '../doc/model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

const createNewTag = async (ctx, next) => {
	let params = ctx.request.body
	let tags = await TagModel.find({name: params.name}).exec()
	try {
		if (tags.length <= 0) {
			let time = new Date().toLocaleString()
			let tag = new TagModel
			tag.name = params.name
			tag.root = params.ifRoot
			tag.parents = params.parents ? params.parents.split(',')  : []
			tag.description = params.description
			tag.children = []
			tag.create_time = time
			tag.update_time = time

			let _tag = await tag.save()

			_tag.parents.forEach(async id => {
				let parent_tag = await TagModel.findOne({_id: id}).exec()
				parent_tag.children.push(_tag.id)
				await parent_tag.save()
			})

			handler(ctx, 200, true)
		} else {
			handler(ctx, 50001)
		}
	} catch (e) {
		console.log(e)
		handler(ctx, 201)
	}
}

const getTagInfo = async (ctx, next) => {
	let id = ctx.request.query.id
	let need_doc = ctx.request.query.need_doc

	try {
		let tag = await TagModel.findOne({_id: id})
			.populate({path: 'parents', select: 'name _id parents', populate: {
				path: 'parents',
				select: 'name _id parents'
			}})
			.populate({path: 'children', select: 'name _id'})
			.exec()

		let parent_list = []
		const sequencify = parents => {
			parents.forEach(parent => {
				parent_list.push({name: parent.name, id: parent._id})
				if (parent.parents.length > 0) sequencify(parent.parents)
			})
		}
		sequencify(tag.parents)

		let _tag = tool.serialize(TAG_BASE_INFO, tag)
		
		if (need_doc) {
			let docs = await DocModel.find({}, 'title abstract').where('tags').in([id]).exec()
			_tag.docs = docs
		}

		_tag.parents = parent_list

		handler(ctx, 200, _tag)
	} catch (e) {
		console.log(e)
		handler(ctx, 50000)
	}
}

export default {
	createNewTag,
	getTagInfo
}
