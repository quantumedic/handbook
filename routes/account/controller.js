import {AccountModel} from './model'
import md5 from 'md5'
import auth from '../../utils/authorization'

const getUserInfo = authorization => {
	return AccountModel.findOne({_id: auth.parse(authorization).uid}, '-password -create_time').then(account => {
		return account ? account : '未查找到该用户'
	}, err => {
		return '未查找到该用户'
	})
}

const createNewUser = params => {
	return AccountModel.find({email: params.email}).exec().then(accounts => {
		if (accounts.length <= 0 ) {
			const user = new AccountModel
			user.email = params.email
			user.username = params.username
			user.password = md5(params.username + params.password)
			user.create_time = new Date()
			user.type = 'reader'
			return user.save().then(account => {
				return {
					uid: account._id,
					token: account.password
				}
			})
		} else {
			return '该邮箱已被注册'
		}
	}, err => {
		return '注册失败'
	})
}

export default {
	getUserInfo,
	createNewUser
}
