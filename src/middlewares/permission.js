const ALLOW_PATH = {
	'/account/register': ['POST'],
	'/account/login': ['POST'],
	'/doc': ['GET'],
	'/tag': ['GET'],
	'/tag/docs': ['GET'],
	'/search/docs': ['GET'],
	'/search/tags': ['GET']
}

const NEED_EDITOR_PATH = {
	'/tag': ['POST', 'PUT'],
	'/doc': ['POST', 'PUT', 'DELETE'],
	'/search/contributions': ['GET']
}

export default {
	check: (method, path) => {
		return ALLOW_PATH[path] != undefined && ALLOW_PATH[path].indexOf(method) >= 0
	},
	permit: (method, path) => {
		return NEED_EDITOR_PATH[path] != undefined && NEED_EDITOR_PATH[path].indexOf(method) >= 0
	}
}
