import moment from 'moment'
import {TagModel, TAG_BASE_INFO} from './model'
import {DocModel} from '../doc/model'
import {handler} from '../../utils/handler'
import tool from '../../utils/tool'

moment.locale('zh-CN')

const createNewTag = async (ctx, next) => {
	let params = ctx.request.body
	let tags = await TagModel.find({name: params.name}).exec()
	try {
		if (tags.length <= 0) {
			let time = new Date().toLocaleString()
			let tag = new TagModel
			tag.name = params.name
			tag.root = params.ifRoot
			tag.parents = [params.parents]
			tag.description = params.description
			tag.children = []
			tag.create_time = time
			tag.update_time = time

			let parent_tag = await TagModel.findOne({_id: params.parents}).exec()
			parent_tag.children.push(_tag.id)
			tag.level = parent_tag.level + 1

			let parent = await parent_tag.save()
			let _tag = await tag.save()

			handler(ctx, 200, true)
		} else {
			handler(ctx, 50001)
		}
	} catch (e) {
		console.log(e)
		handler(ctx, 201)
	}
}

const list_tree = (list, tags, direction) => {
	tags.forEach(tag => {
		list.push({name: tag.name, id: tag._id})
		if (tag[direction].length > 0) list_tree(list, tag[direction], direction)
	})
}

const getTagInfo = async (ctx, next) => {
	let id = ctx.request.query.id
	let need_doc = ctx.request.query.need_doc
	let need_tree = ctx.request.query.need_tree

	try {
		let tag = await TagModel.findOne({_id: id})
			.populate({path: 'parents', select: 'name _id parents', populate: {
				path: 'parents',
				select: 'name _id parents'
			}})
			.populate({path: 'children', select: 'name _id children', populate: {
				path: 'children',
				select: 'name _id children'
			}})
			.exec()

		let _tag = tool.serialize(TAG_BASE_INFO, tag)
		
		if (need_doc) {
			let docs = await DocModel.find({}, 'title abstract update_time')
				.where('status').equals(1)
				.where('tags').in([id]).exec()
			_tag.docs = docs.map(doc => {
				return {
					id:doc._id,
					title: doc.title,
					abstract: doc.abstract,
					update_time: moment(doc.update_time).fromNow()
				}
			})
		}

		if (!need_tree) {
			let parent_list = [], children_list = []
			list_tree(parent_list, tag.parents, 'parents')
			list_tree(children_list, tag.children, 'children')
			_tag.parents = parent_list
			_tag.children = children_list
		}

		handler(ctx, 200, _tag)
	} catch (e) {
		console.log(e)
		handler(ctx, 50000)
	}
}

const getTagList = async (ctx, next) => {
	let params = ctx.request.query

	try {
		let tags = params.ids != undefined
			? await TagModel.find({},  'name _id level').or([
					{
						'level': {$lt: params.level + 1},
						'parents': {$in: params.ids.split(',')}
					},
					{'root': true}
				]).exec()

			: await TagModel.find({level: params.level}, 'name _id level').exec()

		let _tags = tags.map(tag => {
			return { id: tag.id, name: tag.name, level: tag.level }
		})
		handler(ctx, 200, _tags)
			
	} catch (e) {
		console.log(e)
		handler(ctx, 50002)
	}
}

export default {
	createNewTag,
	getTagInfo,
	getTagList
}
