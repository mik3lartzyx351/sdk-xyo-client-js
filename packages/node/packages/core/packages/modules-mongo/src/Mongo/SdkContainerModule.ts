import { BoundWitnessWithMeta, PayloadWithMeta, User } from '@xyo-network/node-core-model'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { AsyncContainerModule, interfaces } from 'inversify'

import { COLLECTIONS } from '../collections'
import { MONGO_TYPES } from '../mongoTypes'
import { getBaseMongoSdk } from './getBaseMongoSdk'

export const SdkContainerModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  await Promise.resolve()
  const boundWitnessSdk = getBaseMongoSdk<BoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
  const payloadSdk = getBaseMongoSdk<PayloadWithMeta>(COLLECTIONS.Payloads)
  const userSdk = getBaseMongoSdk<User>(COLLECTIONS.Users)

  bind<BaseMongoSdk<BoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdk).toConstantValue(boundWitnessSdk)
  bind<BaseMongoSdk<PayloadWithMeta>>(MONGO_TYPES.PayloadSdk).toConstantValue(payloadSdk)
  bind<BaseMongoSdk<User>>(MONGO_TYPES.UserSdk).toConstantValue(userSdk)
})
