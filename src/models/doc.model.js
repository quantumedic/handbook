import mongoose from 'mongoose'
import {autoIncrement} from 'mongoose-plugin-autoinc'

const Schema = mongoose.Schema

const DocSchema = new Schema({
	title: { type: String, default: '' },
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	editors: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
	abstract: { type: String, default: '' },
	content: { type: String, default: '' },
	draft: { type: String, default:'' },
	type: { type: String, default: '' },
	status: { type: Number, default: 0 },
	tags: [ {type: Number, ref: 'Tag'} ],
	reference: { type: String, default: '' },
	create_time: Date,
	update_time: Date,
	last_update_author: { type: Schema.Types.ObjectId, ref: 'User' },
	draft_time: Date,
	collect_count: { type: Number, default: 0 },
	view_count: { type: Number, default: 0 }
}, {collection: 'docs'})


DocSchema.plugin(autoIncrement, {model: 'Doc', startAt: 100})
export const Doc = mongoose.model('Doc', DocSchema)

export const FORMAT_DOC = [
	'title',
	'abstract',
	'content',
	'draft',
	'type',
	'status',
	'tags',
	'reference',
	'collect_count',
	'view_count',
	'create_time',
	'update_time',
	'draft_time',
	'author',
	'editors',
	'last_update_author'
]

export const FORMAT_LIST_DOC = ['title', 'abstract', 'title', 'abstract', 'tags', 'status', 'update_time']
