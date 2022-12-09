import { XyoPayload } from '@xyo-network/payload'
import { Promisable } from '@xyo-network/promise'

import { ModuleDescription } from './ModuleDescription'
import { ModuleFilter } from './ModuleFilter'
import { ModuleQueryResult } from './ModuleQueryResult'
import { XyoQueryBoundWitness } from './Query'
import { XyoModuleParams } from './XyoModule'

export interface ModuleResolver {
  isModuleResolver: boolean
  resolve(filter?: ModuleFilter): Promisable<Module[]>
  tryResolve(filter?: ModuleFilter): Promisable<Module[]>
}

export interface Module<TConfig extends XyoPayload = XyoPayload> {
  address: string
  config: TConfig
  description: () => Promisable<ModuleDescription>
  queries: () => string[]
  query: <T extends XyoQueryBoundWitness = XyoQueryBoundWitness>(query: T, payloads?: XyoPayload[]) => Promisable<ModuleQueryResult>
  queryable: (schema: string, addresses?: string[]) => boolean
  resolver?: ModuleResolver
}

export interface CreatableModule<T extends Module = Module, TParams extends XyoModuleParams = XyoModuleParams> {
  create(params?: TParams): Promise<T>
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor
  }
}

export function creatable() {
  return <U extends CreatableModule>(constructor: U) => {
    constructor
  }
}
