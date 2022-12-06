import { XyoModuleParams } from '@xyo-network/module'
import { PayloadSetSchema } from '@xyo-network/payload'
import { createPayloadSetPlugin, PayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { XyoCryptoCardsMoveSchema } from './Schema'
import { XyoCryptoCardsMoveWitness, XyoCryptoCardsMoveWitnessConfig } from './Witness'

export const XyoCryptoCardsMovePlugin = () =>
  createPayloadSetPlugin<PayloadSetWitnessPlugin<XyoModuleParams<XyoCryptoCardsMoveWitnessConfig>>>(
    { required: { [XyoCryptoCardsMoveSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await XyoCryptoCardsMoveWitness.create(params)
        return result
      },
    },
  )
