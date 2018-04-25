import md5 from 'md5'

export const init = (user, params) => {
	user.email = params.email
	user.username = params.username
	user.password = md5(params.email + params.password)
	user.create_time = new Date().toLocaleString()
	user.type = 'reader'
}

export const update = (source, params) => {
	const props = ['gender', 'username', 'department', 'hospital', 'rank_title', 'phone', 'credential_number']
	props.forEach(prop => {
		source[prop] = params[prop] ? params[prop] : source[prop]
	})
	if (params.phone && params.credential_number) source.type = 'editor'
}

