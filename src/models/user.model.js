import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const User = mongoose.model('User', new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	username: { type: String, required: true },
	realname: { type: String, default: '' },
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

export const FORMAT_USER = [
	'username',
	'realname',
	'type',
	'gender',
	'email',
	'phone',
	'rank_title',
	'department',
	'hospital',
	'credential_number',
	'create_time'
]
