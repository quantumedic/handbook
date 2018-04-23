import mongoose from 'mongoose'
import {autoIncrement} from 'mongoose-plugin-autoinc'

const TagSchema = new mongoose.Schema({
	name: { type: String, required: true },
	root: { type: Boolean, default: false },
	description: { type: String, default: '' },
	parents: [ {type: Number, ref: 'Tag'} ],
	children: [ {type: Number, ref: 'Tag'} ],
	create_time: Date,
	update_time: Date
}, {collection: 'tags'})

TagSchema.plugin(autoIncrement, {model: 'Tag', startAt: 1})
export const TagModel = mongoose.model('Tag', TagSchema)

export const TAG_BASE_INFO  = {
	id: '',
	name: '',
	discription: '',
	parents: [],
	children: [],
	create_time: '',
	update_time: ''
}
