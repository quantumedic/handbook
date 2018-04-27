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
			tag.description = params.description
			tag.parents = []
			tag.create_time = time
			tag.update_time = time

			let parent = await Tag.findById(params.parent).exec()
			if (parent) tag.parents.push(parent._id)
			tag.level = parent ? parent.level + 1 : 0
			let _tag = await tag.save()

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
			.populate({path: 'parents', select: 'name level'})
			.exec()

		let children = await Tag.find({'parents': {$in: [tag._id]}}, 'name level').exec()

		let _tag = format.copy(tag, FORMAT_TAG)
		_tag.parents = tag.parents.map(tag => {
			return format.copy(tag, FORMAT_TAG)
		})
		_tag.children = children.map(tag => {
			return format.copy(tag, FORMAT_TAG)
		})

		handler(ctx, 200, _tag)
	} catch (e) {
		console.log(e)
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
		let tags = await Tag.find({'level': {$eq: params.level}}, 'name level').exec()

		let _tags = tags.map(tag => {
			return format.copy(tag, FORMAT_TAG)
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
