const CODE_LIST = {
	200: 'success',
	201: '参数错误',
	// account error
	30000: '账号不存在',
	30001: '该邮箱已注册',
	30002: '账号密码错误',
	40000: '文档不存在',
	404: 'token错误'
}

export const handler = (ctx, code, result) => {
	ctx.body = {
		code: code,
		msg: CODE_LIST[code] ? CODE_LIST[code] : '未知错误',
		result: result ? result : ''
	}
}
