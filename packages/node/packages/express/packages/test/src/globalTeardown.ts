import { config } from 'dotenv'
config()
import { Config } from 'jest'

/**
 * Jest global teardown method runs after all tests are run
 * https://jestjs.io/docs/configuration#globalteardown-string
 */
module.exports = async (_globalConfig: Config, _projectConfig: Config) => {
  await globalThis.mongo.stop()
  app.close()
}
