import LRU from 'lru-cache'

import { XyoDomainConfigWrapper } from '../DomainConfig'
import { Huri, HuriFetchFunction } from '../Huri'
import { XyoPayload } from '../models'

export class SchemaCache {
  private cache = new LRU<string, XyoPayload | null>({ max: 500, ttl: 1000 * 60 * 5 })
  private fetchFunction?: HuriFetchFunction

  private constructor(fetchFunction?: HuriFetchFunction) {
    this.fetchFunction = fetchFunction
  }

  public async get(schema: string) {
    if (this.cache.get(schema) === undefined) {
      const config = new XyoDomainConfigWrapper()

      const schemaHuri = (await config.discover(schema))?.schema?.[schema]
      if (schemaHuri) {
        const huri = new Huri(schemaHuri, this.fetchFunction)
        const payload = await huri.fetch()
        this.cache.set(schema, payload ?? null)
      }
    }
    return this.cache.get(schema)
  }

  private static instance?: SchemaCache
  static get() {
    if (!this.instance) {
      this.instance = new SchemaCache()
    }
    return this.instance
  }
}
