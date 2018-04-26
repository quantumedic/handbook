import mongoose from 'mongoose'
import {autoIncrement} from 'mongoose-plugin-autoinc'

const TagSchema = new mongoose.Schema({
	name: { type: String, required: true },
	root: { type: Boolean, default: false },
	description: { type: String, default: true },
	parents: [ {type: Number, ref: 'Tag'} ],
	children: [ {type: Number, ref: 'Tag'} ],
	level: Number,
	create_time: Date,
	update_time: Date,
	favor_count: { type: Number, default: 0 }
}, {collection: 'tags'})

TagSchema.plugin(autoIncrement, {model: 'Tag', startAt: 1})
export const Tag = mongoose.model('Tag', TagSchema)

export const FORMAT_TAG = [
	'name',
	'description',
	'level'
]
