import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.connect('mongodb://qianchen:kaini19881219@182.254.146.204:27017/manual')

export const AccountModel = mongoose.model('account', new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	username: { type: String, required: true },
	gender: { type: String, default: ''},
	rank_title: { type: String, default: ''},
	type: { type: String, default: 'reader'},
	hospital: { type: String, default: ''},
	department: { type: String, default: ''},
	documents: [ Schema.Types.ObjectId ],
	collections: [ Schema.Types.ObjectId ],
	create_time: Date,
	last_login_time: Date
}, {collection: 'users'}))

export const USER_BASE_INFO = {
	uid: '',
	username: '',
	gender: '',
	rank_title: '',
	type: '',
	hospital: '',
	department: '',
	create_time: ''
}