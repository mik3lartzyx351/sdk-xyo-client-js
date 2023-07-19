import { QueryBoundWitness } from '@xyo-network/boundwitness-builder'
import {
  AnyConfigSchema,
  Module,
  ModuleConfig,
  ModuleEventData,
  ModuleFilter,
  ModuleFilterOptions,
  ModuleInstance,
  ModuleParams,
  ModuleQueryResult,
  ModuleResolver,
} from '@xyo-network/module-model'
import { Payload, Query } from '@xyo-network/payload-model'
import { Promisable } from '@xyo-network/promise'

import { BridgeConfig } from './Config'

export interface Bridge {
  connect: () => Promisable<boolean>
  disconnect: () => Promisable<boolean>
}

export type BridgeParams<TConfig extends AnyConfigSchema<BridgeConfig> = AnyConfigSchema<BridgeConfig>> = ModuleParams<TConfig>

export interface BridgeModule<TParams extends BridgeParams = BridgeParams, TEventData extends ModuleEventData = ModuleEventData>
  extends ModuleInstance<TParams, TEventData> {
  getRootAddress(): Promisable<string>
  targetConfig(address: string): ModuleConfig
  targetDiscover(address?: string): Promisable<Payload[]>
  targetDownResolver(address?: string): ModuleResolver
  targetQueries(address: string): string[]
  targetQuery(address: string, query: Query, payloads?: Payload[]): Promisable<ModuleQueryResult>
  targetQueryable(address: string, query: QueryBoundWitness, payloads?: Payload[], queryConfig?: ModuleConfig): Promisable<boolean>

  targetResolve(address: string, filter?: ModuleFilter, options?: ModuleFilterOptions): Promisable<Module[]>
  targetResolve(address: string, nameOrAddress: string, options?: ModuleFilterOptions): Promisable<Module | undefined>
  targetResolve(
    address: string,
    nameOrAddressOrFilter?: ModuleFilter | string,
    options?: ModuleFilterOptions,
  ): Promisable<Module | Module[] | undefined>
}

export type BridgeInstance<TParams extends BridgeParams = BridgeParams, TEventData extends ModuleEventData = ModuleEventData> = BridgeModule<
  TParams,
  TEventData
> &
  Bridge
