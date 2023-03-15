import { config } from 'dotenv'
config()
import { PayloadValidator } from '@xyo-network/payload-validator'
import { XyoSchemaNameValidator } from '@xyo-network/schema-name-validator'
import { Config } from 'jest'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Augment global scope with shared variables (must be var)
declare global {
  // eslint-disable-next-line no-var
  var mongo: MongoMemoryServer
}

/**
 * Jest global setup method runs before any tests are run
 * https://jestjs.io/docs/configuration#globalsetup-string
 */
module.exports = async (_globalConfig: Config, _projectConfig: Config) => {
  PayloadValidator.setSchemaNameValidatorFactory((schema) => new XyoSchemaNameValidator(schema))
  const mongo = new MongoMemoryServer()
  globalThis.mongo = mongo
  await mongo.start()
  const uri = mongo.getUri()
  process.env.MONGO_CONNECTION_STRING = uri
  await Promise.resolve()
}
