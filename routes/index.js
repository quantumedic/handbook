import mongoose from 'mongoose'

import account from './account/router'
import doc from './doc/router'
import tag from './tag/router'
import search from './search/router'


mongoose.connect('mongodb://qianchen:kaini19881219@182.254.146.204:27017/manual')

export const routes = [
	account,
	doc,
	tag,
	search
]
