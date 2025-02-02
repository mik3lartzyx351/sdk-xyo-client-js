import { AbstractWitness } from '@xyo-network/abstract-witness'
import { EthereumGasBlocknativePayload, EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import { TimestampWitnessParams } from '@xyo-network/witness-timestamp'

import { EthereumGasBlocknativeWitnessConfig } from './Config'
import { getGasFromBlocknative } from './lib'
import { EthereumGasBlocknativeWitnessConfigSchema } from './Schema'

export type EthereumGasBlocknativeWitnessParams = TimestampWitnessParams<AnyConfigSchema<EthereumGasBlocknativeWitnessConfig>>
export class EthereumGasBlocknativeWitness extends AbstractWitness<EthereumGasBlocknativeWitnessParams> {
  static override configSchemas = [EthereumGasBlocknativeWitnessConfigSchema]

  protected override async observeHandler(): Promise<Payload[]> {
    const fields = await getGasFromBlocknative()
    const payload = new PayloadBuilder<EthereumGasBlocknativePayload>({
      schema: EthereumGasBlocknativeSchema,
    })
      .fields(fields)
      .build()
    return [payload]
  }
}
