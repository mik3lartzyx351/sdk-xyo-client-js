import { Provider } from '@ethersproject/providers'
import { assertEx } from '@xylabs/assert'
import { XyoEthereumGasEthersPayload, XyoEthereumGasEthersSchema } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { AnyConfigSchema, ModuleEventData, ModuleParams } from '@xyo-network/module'
import { XyoPayloadBuilder } from '@xyo-network/payload-builder'
import { XyoPayload } from '@xyo-network/payload-model'
import { TimestampWitness } from '@xyo-network/witness'

import { XyoEthereumGasEthersWitnessConfig } from './Config'
import { getGasFromEthers } from './lib'
import { XyoEthereumGasEthersWitnessConfigSchema } from './Schema'

export type XyoEthereumGasEthersWitnessParams = ModuleParams<
  AnyConfigSchema<XyoEthereumGasEthersWitnessConfig>,
  ModuleEventData,
  {
    provider?: Provider
  }
>

export class XyoEthereumGasEthersWitness<
  TParams extends XyoEthereumGasEthersWitnessParams = XyoEthereumGasEthersWitnessParams,
> extends TimestampWitness<TParams> {
  static override configSchema = XyoEthereumGasEthersWitnessConfigSchema

  protected provider?: Provider

  protected constructor(params: TParams) {
    super(params)
    this.provider = params?.provider
  }

  static override async create<TParams extends XyoEthereumGasEthersWitnessParams>(params?: TParams) {
    return await super.create(params)
  }

  override async observe(): Promise<XyoPayload[]> {
    const payload = new XyoPayloadBuilder<XyoEthereumGasEthersPayload>({ schema: XyoEthereumGasEthersSchema })
      .fields(await getGasFromEthers(assertEx(this.provider, 'Provider Required')))
      .build()
    return super.observe([payload])
  }
}
