import { XyoModule } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'

import { XyoWitnessObserveQueryPayloadSchema, XyoWitnessQueryPayload } from './Query'
import { Witness } from './Witness'

export class XyoWitnessWrapper implements Witness {
  protected module: XyoModule

  constructor(module: XyoModule) {
    this.module = module
  }

  public get queries() {
    return this.module.queries
  }

  async observe(payload?: Partial<XyoPayload> | undefined): Promise<XyoPayload | null> {
    const query: XyoWitnessQueryPayload = { payload, schema: XyoWitnessObserveQueryPayloadSchema }
    return (await this.module.query(query))[1][0]
  }
}
