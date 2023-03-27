import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'
import { XyoCryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { DivinerWrapper } from '@xyo-network/diviner-wrapper'
import { Task } from '@xyo-network/shared'

import { getDiviner } from './getDiviner'
import { reportCryptoPrices } from './reportCryptoPrices'
import { reportDivinerResult } from './reportDivinerResult'

export const getTask = (): Task => {
  const logger = getDefaultLogger()
  const task: Task = async () => {
    try {
      logger.log('Reporting Crypto Prices')
      const payloads = await reportCryptoPrices()
      logger.log('Reported Crypto Prices')
      logger.log('Divining Aggregated Crypto Prices')
      const diviner = await getDiviner()
      const results = await new DivinerWrapper({ module: diviner }).divine(payloads)
      const result = results.find((p) => p.schema === XyoCryptoMarketAssetSchema)
      const answer = assertEx(result, 'Empty XyoCryptoMarketAssetPayload response from diviner')
      logger.log('Divined Aggregated Crypto Prices')
      logger.log('Reporting Aggregated Crypto Prices')
      await reportDivinerResult(answer)
      logger.log('Reported Aggregated Crypto Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
