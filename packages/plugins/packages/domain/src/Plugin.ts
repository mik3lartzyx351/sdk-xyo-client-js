import { assertEx } from '@xylabs/assert'
import { XyoPayload } from '@xyo-network/payload'
import { createXyoPayloadPlugin } from '@xyo-network/payload-plugin'

import { XyoDomainWitnessConfig, XyoDomainWitnessConfigSchema } from './Config'
import { XyoDomainPayload } from './Payload'
import { XyoDomainSchema } from './Schema'
import { XyoDomainWitness } from './Witness'
import { XyoDomainPayloadWrapper } from './Wrapper'

export const XyoDomainPayloadPlugin = () =>
  createXyoPayloadPlugin<XyoDomainPayload, XyoDomainWitnessConfig>({
    schema: XyoDomainSchema,
    witness: (config): XyoDomainWitness => {
      return new XyoDomainWitness({
        ...config,
        schema: XyoDomainWitnessConfigSchema,
        targetSchema: XyoDomainSchema,
      })
    },
    wrap: (payload: XyoPayload): XyoDomainPayloadWrapper => {
      assertEx(payload.schema === XyoDomainSchema)
      return new XyoDomainPayloadWrapper(payload as XyoDomainPayload)
    },
  })
