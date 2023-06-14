import { WitnessConfig } from '@xyo-network/witness'

export type DomainWitnessConfigSchema = 'network.xyo.domain.witness.config'
export const DomainWitnessConfigSchema = 'network.xyo.domain.witness.config'

export type DomainWitnessConfig = WitnessConfig<{
  domain?: string
  schema: DomainWitnessConfigSchema
}>
