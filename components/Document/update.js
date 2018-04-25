import {TagModel} from '../../routes/tag/model'

export const init = (doc, tag_id) => {
	let time = new Date().toLocaleString()
	doc.create_time = time
	doc.update_time = time
	doc.draft_time = time
	doc.tags = [tag_id]
}

export const fullfil = doc => {
	const trace = tags => {
		try {
			tags.forEach(async tag => {
				let _tag = await TagModel.findOne({_id: tag}, '_id parents').exec()
				
				doc.tags = Array.from(new Set(_tag.parents.concat(doc.tags)))
				_tag.parents.length > 0
					? trace(_tag.parents)
					: doc.save()
			})
		} catch (e) {
			console.log(e)
		}
			
	}
	trace(doc.tags)
}

export const update = (source, params) => {
	let time = new Date().toLocaleString()
	let props = ['title', 'abstract', 'reference']

	props.forEach(prop => {
		source[prop] = params[prop]
	})
	source.draft = params.content
	source.draft_time = time

	if (params.publish) {
		source.content = source.draft
		source.update_time = source.draft_time
		source.status = 1
	}
}