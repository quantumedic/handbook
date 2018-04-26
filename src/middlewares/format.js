import moment from 'moment'

moment.locale('zh-CN')

const copy = (obj, props, fromNow) => {
	let _obj = {}
	if (obj._id) _obj.id = obj._id

	props.forEach(prop => {
		prop.search('time') >= 0
			? _obj[prop] = fromNow ? moment(obj[prop]).fromNow() : obj[prop].toLocaleString()
			: _obj[prop] = obj[prop]
	})
	return _obj
}

const tree = (tags, direction) => {
	return tags.map(tag => {
		return {
			id: tag._id,
			name: tag.name,
			[direction]: tag[direction].length > 0 ? tree(tag[direction], direction): []
		}
	})
}

const flatten = (tags, direction) => {
	let result = []
	const exec = list => {
		list.forEach(item => {
			result.push({
				id: item.id,
				name: item.name
			})
			if (item[direction].length > 0) exec(item[direction])
		})
	}
	exec(tags)
	return result
}

export default {
	copy,
	tree,
	flatten
}
