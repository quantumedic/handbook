import dev_env from './dev'
import test_env from './test'

module.exports = {
	dev: dev_env,
	test: test_env
}[process.env.NODE_ENV || 'dev']
