import {User} from '../../models/user.model'
import {Tag, FORMAT_TAG} from '../../models/tag.model'
import {handler} from '../../middlewares/handler'
import format from '../../middlewares/format'

const create = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let tags = await Tag.find({name: params.name}).exec()

		if (tags.length <= 0) {
			let tag = new Tag
			let time = new Date().toLocaleString()

			tag.name = params.name
			tag.root = params.ifRoot
			tag.description = params.description
			tag.parents = []
			tag.children = []
			tag.create_time = time
			tag.update_time = time
			tag.level = 1
			let _tag = await tag.save()

			if (!tag.root) {
				let parent = await Tag.findById(params.parent).exec()
				tag.parents.push(parent._id)
				parent.children.push(_tag._id)
				tag.level = parent.level + 1
				await tag.save()
				await parent.save()
			}


			handler(ctx, 200, format.copy(_tag, FORMAT_TAG))
		} else {
			handler(ctx, 50001)
		}
	} catch (e) {
		console.log(e)
		handler(ctx, 201)
	}
}

const getInfo = async (ctx, next) => {
	let id = ctx.request.query.id
	let tree = ctx.request.query.tree

	try {
		let tag = await Tag.findById(id)
			.populate({path: 'parents', select: 'name parents', populate: {
				path: 'parents',
				select: 'name parents'
			}})
			.populate({path: 'children', select: 'name children', populate: {
				path: 'children',
				select: 'name children'
			}})
			.exec()

		let _tag = format.copy(tag, FORMAT_TAG)
		_tag.children = format.tree(tag.children, 'children')
		_tag.parents = format.tree(tag.parents, 'parents')

		if (!tree) {
			_tag.children = format.flatten(_tag.children, 'children')
			_tag.parents = format.flatten(_tag.parents, 'parents')
		}

		handler(ctx, 200, _tag)
	} catch (e) {
		handler(ctx, 50000)
	}
}

const favor = async (ctx, next) => {
	let params = ctx.request.body

	try {
		let user = await User.findById(ctx.state.user.uid).exec()

		if (user.favor_tags.indexOf(params.id) < 0) {
			let tag = await Tag.findByIdAndUpdate(params.id, {$inc: {favor_count: 1}}).exec()

			user.favor_tags.push(tag._id)
			await user.save()

			handler(ctx, 200, true)
		} else {
			handler(ctx, 50003)
		}
	} catch (e) {
		handler(ctx, 50000)
	}
}

const getList = async (ctx, next) => {
	let params = ctx.request.query

	try {
		let tags = await Tag.find({}, 'name level').or([
				{
					'level': {$lt: params.level + 1},
					'parents': {$in: params.ids.split(',')}
				},
				{
					'root': true
				}
			]).exec()

		let _tags = tags.map(tag => {
			return { id: tag._id, name: tag.name, level: tag.level }
		})

		handler(ctx, 200, _tags)
	} catch (e) {
		console.log(e)
		handler(ctx, 50002)
	}
}

export default {
	create,
	favor,
	getInfo,
	getList
}
