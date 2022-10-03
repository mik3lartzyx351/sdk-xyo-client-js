import { assertEx } from '@xylabs/assert'
import { forget } from '@xylabs/forget'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchivistWrapper, XyoMemoryArchivist } from '@xyo-network/archivist'
import { ModuleQueryResult, QueryBoundWitnessWrapper, XyoModule, XyoModuleResolverFunc, XyoQueryBoundWitness } from '@xyo-network/module'
import { XyoModuleInstanceSchema } from '@xyo-network/module-instance-payload-plugin'
import { XyoPayloads } from '@xyo-network/payload'

import { NodeConfig } from './Config'
import { NodeModule } from './NodeModule'
import { XyoNodeAttachedQuerySchema, XyoNodeAttachQuerySchema, XyoNodeDetachQuerySchema, XyoNodeQuery, XyoNodeRegisteredQuerySchema } from './Queries'
export abstract class XyoNode<TConfig extends NodeConfig = NodeConfig, TModule extends XyoModule = XyoModule>
  extends XyoModule<TConfig>
  implements NodeModule
{
  constructor(config?: TConfig, account?: XyoAccount, resolver?: XyoModuleResolverFunc) {
    super(config, account, resolver)
    forget(this.storeInstanceData())
  }

  private async storeInstanceData() {
    const payload = { address: this.address, queries: this.queries, schema: XyoModuleInstanceSchema }
    const [bw] = await this.bindResult([payload])
    await new XyoArchivistWrapper(this.archivist).insert([bw, payload])
  }

  /** Query Functions - Start */
  abstract attach(_address: string): void
  abstract detach(_address: string): void
  abstract resolve(_address: string): TModule | null

  private _archivist?: XyoModule
  public get archivist() {
    if (!this._archivist) {
      this._archivist = this._archivist ?? (this.config?.archivist ? this.resolver?.(this.config?.archivist) : undefined) ?? new XyoMemoryArchivist()
    }
    return this._archivist
  }

  registered(): string[] {
    throw new Error('Method not implemented.')
  }
  attached(): string[] {
    throw new Error('Method not implemented.')
  }

  registeredModules(): TModule[] {
    throw new Error('Method not implemented.')
  }
  attachedModules(): TModule[] {
    throw new Error('Method not implemented.')
  }
  /** Query Functions - End */

  override query<T extends XyoQueryBoundWitness = XyoQueryBoundWitness>(query: T, payloads?: XyoPayloads): Promise<ModuleQueryResult> {
    const wrapper = QueryBoundWitnessWrapper.parseQuery<XyoNodeQuery>(query)
    const typedQuery = wrapper.query.payload
    assertEx(this.queryable(typedQuery.schema, wrapper.addresses))

    const queryAccount = new XyoAccount()
    const resultPayloads: XyoPayloads = []
    switch (typedQuery.schema) {
      case XyoNodeAttachQuerySchema: {
        this.attach(typedQuery.address)
        break
      }
      case XyoNodeDetachQuerySchema: {
        this.detach(typedQuery.address)
        break
      }
      case XyoNodeAttachedQuerySchema: {
        this.attached()
        break
      }
      case XyoNodeRegisteredQuerySchema: {
        this.registered()
        break
      }
      default:
        return super.query(query, payloads)
    }
    return this.bindResult(resultPayloads, queryAccount)
  }

  register(_module: TModule): void {
    throw new Error('Method not implemented.')
  }
}
