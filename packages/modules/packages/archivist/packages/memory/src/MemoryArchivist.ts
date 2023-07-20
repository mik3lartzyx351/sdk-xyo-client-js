import { assertEx } from '@xylabs/assert'
import { fulfilled } from '@xylabs/promise'
import { AbstractDirectArchivist } from '@xyo-network/abstract-archivist'
import {
  ArchivistAllQuerySchema,
  ArchivistClearQuerySchema,
  ArchivistCommitQuerySchema,
  ArchivistConfig,
  ArchivistConfigSchema,
  ArchivistDeleteQuerySchema,
  ArchivistInsertQuery,
  ArchivistInsertQuerySchema,
  ArchivistInstance,
  ArchivistModuleEventData,
} from '@xyo-network/archivist-model'
import { BoundWitness } from '@xyo-network/boundwitness-model'
import { AnyConfigSchema, creatableModule, ModuleInstance, ModuleParams } from '@xyo-network/module'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { PromisableArray } from '@xyo-network/promise'
import compact from 'lodash/compact'
import { LRUCache } from 'lru-cache'

export type MemoryArchivistConfigSchema = 'network.xyo.archivist.memory.config'
export const MemoryArchivistConfigSchema: MemoryArchivistConfigSchema = 'network.xyo.archivist.memory.config'

export type MemoryArchivistConfig = ArchivistConfig<{
  max?: number
  schema: MemoryArchivistConfigSchema | ArchivistConfig['schema']
}>

export type MemoryArchivistParams<TConfig extends AnyConfigSchema<MemoryArchivistConfig> = AnyConfigSchema<MemoryArchivistConfig>> =
  ModuleParams<TConfig>
@creatableModule()
export class MemoryArchivist<
    TParams extends MemoryArchivistParams<AnyConfigSchema<MemoryArchivistConfig>> = MemoryArchivistParams,
    TEventData extends ArchivistModuleEventData = ArchivistModuleEventData,
  >
  extends AbstractDirectArchivist<TParams, TEventData>
  implements ArchivistInstance, ModuleInstance
{
  static override configSchemas = [MemoryArchivistConfigSchema, ArchivistConfigSchema]

  private _cache?: LRUCache<string, Payload>

  get cache() {
    this._cache = this._cache ?? new LRUCache<string, Payload>({ max: this.max })
    return this._cache
  }

  get max() {
    return this.config?.max ?? 10000
  }

  override get queries() {
    return [
      ArchivistAllQuerySchema,
      ArchivistDeleteQuerySchema,
      ArchivistClearQuerySchema,
      ArchivistInsertQuerySchema,
      ArchivistCommitQuerySchema,
      ...super.queries,
    ]
  }

  protected override allHandler(): PromisableArray<Payload> {
    return compact(this.cache.dump().map((value) => value[1].value))
  }

  protected override clearHandler(): void | Promise<void> {
    this.cache.clear()
    return this.emit('cleared', { module: this })
  }

  protected override async commitHandler(): Promise<BoundWitness[]> {
    const payloads = assertEx(await this.allHandler(), 'Nothing to commit')
    const settled = await Promise.allSettled(
      compact(
        Object.values((await this.parents()).commit ?? [])?.map(async (parent) => {
          const queryPayload = PayloadWrapper.wrap<ArchivistInsertQuery>({
            payloads: await Promise.all(payloads.map((payload) => PayloadWrapper.hashAsync(payload))),
            schema: ArchivistInsertQuerySchema,
          })
          const query = await this.bindQuery(queryPayload, payloads)
          return (await parent?.query(query[0], query[1]))?.[0]
        }),
      ),
    )
    await this.clearHandler()
    return compact(settled.filter(fulfilled).map((result) => result.value))
  }

  protected override async deleteHandler(hashes: string[]): Promise<boolean[]> {
    const found = hashes.map((hash) => {
      return this.cache.delete(hash)
    })
    await this.emit('deleted', { found, hashes, module: this })
    return found
  }

  protected override async getHandler(hashes: string[]): Promise<Payload[]> {
    return compact(
      await Promise.all(
        hashes.map(async (hash) => {
          const payload = this.cache.get(hash) ?? (await super.getHandler([hash]))[0] ?? null
          if (this.storeParentReads) {
            // NOTE: `payload` can actually be `null` here but TS doesn't seem
            // to recognize it. LRUCache claims not to support `null`s via their
            // types but seems to under the hood just fine.
            this.cache.set(hash, payload)
          }
          return payload
        }),
      ),
    )
  }

  protected async insertHandler(payloads: Payload[]): Promise<BoundWitness[]> {
    await Promise.all(
      payloads.map((payload) => {
        return this.insertPayloadIntoCache(payload)
      }),
    )

    const [result] = await this.bindQueryResult({ payloads, schema: ArchivistInsertQuerySchema }, payloads)
    const parentBoundWitnesses: BoundWitness[] = []
    const parents = await this.parents()
    if (Object.entries(parents.write ?? {}).length) {
      // We store the child bw also
      parentBoundWitnesses.push(...(await this.writeToParents([result[0], ...payloads])))
    }
    const boundWitnesses = [result[0], ...parentBoundWitnesses]
    await this.emit('inserted', { boundWitnesses, module: this })
    return boundWitnesses
  }

  private async insertPayloadIntoCache(payload: Payload): Promise<Payload> {
    const wrapper = PayloadWrapper.wrap(payload)
    const payloadWithMeta = { ...payload, _hash: await wrapper.hashAsync(), _timestamp: Date.now() }
    this.cache.set(payloadWithMeta._hash, payloadWithMeta)
    return payloadWithMeta
  }
}
