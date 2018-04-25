export const tagify = doc => {
	doc.tags = doc.tags.map(tag => {
		return {
			id: tag._id,
			name: tag.name,
			level: tag.level
		}
	})
	return doc
}
