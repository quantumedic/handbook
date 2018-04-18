import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.connect('mongodb://qianchen:kaini19881219@182.254.146.204:27017/manual')

export const ArticleModel = mongoose.model('article', new Schema({
	title: String,
	description: String,
	content: String
}, {collection: 'articles'}))