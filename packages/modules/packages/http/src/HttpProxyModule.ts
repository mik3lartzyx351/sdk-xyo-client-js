import { assertEx } from '@xylabs/assert'
import { XyoArchivistApi } from '@xyo-network/api'
import {
  AbstractModuleConfig,
  AbstractModuleConfigSchema,
  creatable,
  Module,
  ModuleDescription,
  ModuleParams,
  ModuleQueryResult,
  ModuleWrapper,
  XyoQueryBoundWitness,
} from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'
import { XyoApiConfig } from '@xyo-network/sdk'

export interface HttpProxyModuleParams extends ModuleParams {
  address: string
  apiConfig: XyoApiConfig
}

@creatable()
export class HttpProxyModule implements Module {
  static configSchema = AbstractModuleConfigSchema
  protected _config: AbstractModuleConfig | undefined
  protected _queries: string[] | undefined

  protected constructor(protected readonly _api: XyoArchivistApi, protected readonly _address: string) {}

  public get address(): string {
    return this._address
  }
  public get config(): AbstractModuleConfig {
    if (!this._config) throw new Error('Missing config')
    return this._config
  }
  static async create(params: HttpProxyModuleParams): Promise<HttpProxyModule> {
    const { address, apiConfig } = params
    const api = new XyoArchivistApi(apiConfig)
    const instance = new this(api, address)
    const description = assertEx(await api.addresses.address(address).get(), 'Error obtaining module description')
    instance._queries = description.queries
    const config = assertEx((await new ModuleWrapper(instance).discover())[0], 'Error obtaining module config')
    instance._config = config
    return instance
  }
  public as<TModule extends Module = Module>(): TModule {
    return this as unknown as TModule
  }
  public async description(): Promise<ModuleDescription> {
    return assertEx(await this._api.addresses.address(this.address).get())
  }
  public queries(): string[] {
    if (!this._queries) throw new Error('Missing queries')
    return this._queries
  }
  async query<T extends XyoQueryBoundWitness = XyoQueryBoundWitness>(query: T, payloads?: XyoPayload[]): Promise<ModuleQueryResult> {
    const data = payloads?.length ? [query, payloads] : [query]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await this._api.addresses.address(this.address).post(data as any)
    return response as unknown as ModuleQueryResult
  }
  public queryable(schema: string, _addresses?: string[] | undefined) {
    return this.queries().includes(schema)
  }
}
