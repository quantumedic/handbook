import {TagModel} from '../../routes/tag/model'

export const init = (parent, tag, params) => {
	let time = new Date().toLocaleString()

	tag.name = params.name
	tag.root = params.ifRoot
	tag.parents = [params.parent]
	tag.description = params.description
	tag.children = []
	tag.create_time = time
	tag.update_time = time
	tag.level = parent.level + 1
}
