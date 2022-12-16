import { AddressPayload, AddressSchema } from '@xyo-network/address-payload-plugin'
import { ArchivistWrapper } from '@xyo-network/archivist'
import { AbstractModule, ModuleFilter, ModuleWrapper } from '@xyo-network/module'
import { isXyoPayloadOfSchemaType, PayloadWrapper } from '@xyo-network/payload'
import { Promisable } from '@xyo-network/promise'
import compact from 'lodash/compact'

import { AbstractNode } from './AbstractNode'
import { NodeModule } from './NodeModule'
import {
  XyoNodeAttachedQuery,
  XyoNodeAttachedQuerySchema,
  XyoNodeAttachQuery,
  XyoNodeAttachQuerySchema,
  XyoNodeDetachQuery,
  XyoNodeDetachQuerySchema,
  XyoNodeRegisteredQuery,
  XyoNodeRegisteredQuerySchema,
} from './Queries'

export class NodeWrapper<TModule extends AbstractNode = AbstractNode> extends ModuleWrapper<TModule> implements NodeModule {
  public isModuleResolver = true

  private _archivist?: ArchivistWrapper

  public get archivist() {
    this._archivist = this._archivist ?? new ArchivistWrapper(this.module)
    return this._archivist
  }

  async attach(address: string, name?: string): Promise<void> {
    const queryPayload = PayloadWrapper.parse<XyoNodeAttachQuery>({ address, name, schema: XyoNodeAttachQuerySchema })
    await this.sendQuery(queryPayload)
  }

  async attached(): Promise<string[]> {
    const queryPayload = PayloadWrapper.parse<XyoNodeAttachedQuery>({ schema: XyoNodeAttachedQuerySchema })
    const payloads: AddressPayload[] = (await this.sendQuery(queryPayload)).filter(isXyoPayloadOfSchemaType<AddressPayload>(AddressSchema))
    return payloads.map((p) => p.address)
  }

  async attachedModules(): Promise<AbstractModule[]> {
    const addresses = await this.attached()
    return compact(await this.resolve({ address: addresses }))
  }

  async detach(address: string): Promise<void> {
    const queryPayload = PayloadWrapper.parse<XyoNodeDetachQuery>({ address, schema: XyoNodeDetachQuerySchema })
    await this.sendQuery(queryPayload)
  }

  register(mod: AbstractModule): void {
    return this.module.register(mod)
  }

  async registered(): Promise<string[]> {
    const queryPayload = PayloadWrapper.parse<XyoNodeRegisteredQuery>({ schema: XyoNodeRegisteredQuerySchema })
    const payloads: AddressPayload[] = (await this.sendQuery(queryPayload)).filter(isXyoPayloadOfSchemaType<AddressPayload>(AddressSchema))
    return payloads.map((p) => p.address)
  }

  async registeredModules(): Promise<AbstractModule[]> {
    return await this.module.registeredModules()
  }

  resolve(filter: ModuleFilter): Promisable<AbstractModule[]> {
    return this.module.resolve(filter)
  }

  tryResolve(filter: ModuleFilter): Promisable<AbstractModule[]> {
    return this.module.tryResolve(filter)
  }

  unregister(mod: AbstractModule): void {
    return this.module.unregister(mod)
  }
}
