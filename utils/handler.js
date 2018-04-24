const CODE_LIST = {
	200: 'success',
	201: '参数错误',
	// account error
	30000: '账号不存在',
	30001: '该邮箱已注册',
	30002: '账号密码错误',
	40000: '文档不存在',
	40001: '无法创建文档',
	40002: '设置标签失败',
	50000: '分类不存在',
	50001: '该分类已存在',
	50002: '没有找到任何分类',
	404: 'token错误'
}

export const handler = (ctx, code, result) => {
	ctx.body = {
		code: code,
		msg: CODE_LIST[code] ? CODE_LIST[code] : '未知错误',
		result: result ? result : ''
	}
}
