const CODE_LIST = {
	200: 'success',
	201: '参数错误',
	203: '你没有权限做此操作',
	204: '尚未登录',
	// user error
	30000: '该账号尚未注册',
	30001: '该邮箱已注册',
	30002: '账号密码错误',
	30003: '账号信息不存在',
	30004: '无法修改该信息',
	// doc error
	40000: '文档不存在',
	40001: '无法创建文档',
	40002: '设置标签失败',
	40003: '没有找到任何符合条件的文档',
	// tag error
	50000: '分类不存在',
	50001: '该分类已存在',
	50002: '没有找到任何分类',
	50003: '不能重复操作',
	404: 'token错误'
}

export const handler = (ctx, code, result) => {
	ctx.body = {
		code: code,
		msg: CODE_LIST[code] ? CODE_LIST[code] : '未知错误',
		result: result ? result : ''
	}
}
