import { Payload } from '@xyo-network/payload-model'

export type ModuleErrorSchema = 'network.xyo.error.module'
export const ModuleErrorSchema: ModuleErrorSchema = 'network.xyo.error.module'

export type ModuleError = Payload<{
  message?: string
  name?: string
  query?: string
  schema: ModuleErrorSchema
  sources?: string[]
}>
