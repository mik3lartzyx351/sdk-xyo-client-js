import { Account } from '@xyo-network/account'
import { AddressSpaceDiviner } from '@xyo-network/diviner'
import {
  BoundWitnessWithMeta,
  PayloadStatsQueryPayload,
  PayloadStatsQuerySchema,
  PayloadStatsSchema,
  PayloadWithMeta,
} from '@xyo-network/node-core-model'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock, MockProxy } from 'jest-mock-extended'

import { COLLECTIONS } from '../../../collections'
import { MongoDBPayloadStatsDiviner, MongoDBPayloadStatsDivinerConfigSchema } from '../MongoDBPayloadStatsDiviner'

describe('MongoDBPayloadStatsDiviner', () => {
  const phrase = 'temp'
  const address = new Account({ phrase }).addressValue.hex
  const addressSpaceDiviner: MockProxy<AddressSpaceDiviner> = mock<AddressSpaceDiviner>()
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  const payloadSdk = new BaseMongoSdk<PayloadWithMeta>({
    collection: COLLECTIONS.Payloads,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })

  let sut: MongoDBPayloadStatsDiviner
  beforeAll(async () => {
    sut = await MongoDBPayloadStatsDiviner.create({
      addressSpaceDiviner,
      boundWitnessSdk,
      config: { schema: MongoDBPayloadStatsDivinerConfigSchema },
      logger,
      payloadSdk,
    })
  })
  describe('divine', () => {
    describe('with address supplied in query', () => {
      it('divines results for the address', async () => {
        const query: PayloadStatsQueryPayload = { address, schema: PayloadStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBe(PayloadStatsSchema)
        expect(actual.count).toBeNumber()
      })
    })
    describe('with no address supplied in query', () => {
      it('divines results for all addresses', async () => {
        const query: PayloadStatsQueryPayload = { schema: PayloadStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBe(PayloadStatsSchema)
        expect(actual.count).toBeNumber()
      })
    })
  })
})
