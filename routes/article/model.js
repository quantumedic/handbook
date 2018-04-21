import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.connect('mongodb://qianchen:kaini19881219@182.254.146.204:27017/manual')

export const ArticleModel = mongoose.model('article', new Schema({
	title: { type: String, default: '' },
	abstract: { type: String, default: '' },
	content: { type: String, default: '' },
	type: { type: String, default: 'disease' },
	status: { type: Number, default: 0 },
	belong: Array,
	related: Array,
	reference: Array,
	create_time: Date,
	update_time: Date
}, {collection: 'articles'}))

export const ARTICLE_BASE_INFO = {
	id: '',
	title: '',
	abstract: '',
	content: '',
	type: '',
	status: '',
	belong: [],
	related: [],
	reference: [],
	create_time: '',
	update_time: ''
}
