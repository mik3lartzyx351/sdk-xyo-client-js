import { config } from 'dotenv'
config()
import { assertEx } from '@xylabs/assert'
import { Account } from '@xyo-network/account'
import { XyoArchive } from '@xyo-network/api'
import { PayloadValidator } from '@xyo-network/payload-validator'
import { XyoSchemaNameValidator } from '@xyo-network/schema-name-validator'

import { claimArchive, getArchive, setArchiveAccessControl, signInUser } from './testUtil'

/**
 * Jest global setup method run before
 * any tests are run
 * https://jestjs.io/docs/configuration#globalsetup-string
 */
module.exports = async () => {
  PayloadValidator.setSchemaNameValidatorFactory((schema) => new XyoSchemaNameValidator(schema))
  const testArchives = [
    { accessControl: false, name: 'temp' },
    { accessControl: true, name: 'temp-private' },
  ]
  for (const testArchive of testArchives) {
    let archive: XyoArchive
    const { name, accessControl } = testArchive
    const phrase = assertEx(process.env.ACCOUNT_SEED, 'ACCOUNT_SEED ENV VAR required')
    const account = new Account({ phrase })
    const token = await signInUser({
      address: account.addressValue.bn.toString('hex'),
      privateKey: account.private.bn.toString('hex'),
    })
    try {
      archive = await getArchive(name, token)
    } catch (error) {
      console.log(`${name} archive does not exist, creating...`)
      archive = await claimArchive(token, name)
      if (accessControl) {
        archive = await setArchiveAccessControl(token, name, { accessControl, archive: name })
      }
    }
    assertEx(archive.archive === name, `ERROR: ${name} archive does not exist`)
    assertEx(archive.accessControl === accessControl, `ERROR: ${name} archive has incorrect permissions`)
  }
}
