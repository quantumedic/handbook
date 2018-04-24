import mongoose from 'mongoose'
import {autoIncrement} from 'mongoose-plugin-autoinc'

const DocSchema = new mongoose.Schema({
	title: { type: String, default: '' },
	abstract: { type: String, default: '' },
	content: { type: String, default: '' },
	draft: { type: String, default:'' },
	type: { type: String, default: '' },
	status: { type: Number, default: 0 },
	tags: [ {type: Number, ref: 'Tag'} ],
	reference: { type: String, default: '' },
	create_time: Date,
	update_time: Date,
	draft_time: Date
}, {collection: 'docs'})


DocSchema.plugin(autoIncrement, {model: 'Document', startAt: 100})
export const DocModel = mongoose.model('Document', DocSchema)

export const DOC_BASE_INFO = {
	id: '',
	title: '',
	abstract: '',
	content: '',
	draft: '',
	type: '',
	status: '',
	tags: [],
	reference: [],
	create_time: '',
	update_time: '',
	draft_time: ''
}
