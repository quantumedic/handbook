import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const AccountModel = mongoose.model('account', new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	username: { type: String, required: true },
	phone: { type: String, default: '' },
	credential_number: { type: String, default: '' },
	gender: { type: String, default: ''},
	rank_title: { type: String, default: ''},
	type: { type: String, default: 'reader'},
	hospital: { type: String, default: ''},
	department: { type: String, default: ''},
	documents: [ {type: Number, ref: 'Document'} ],
	favor_tags: [ {type: Number, ref: 'Tag'} ],
	collections: [ {type: Number, ref: 'Document'} ],
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
	department: ''
}