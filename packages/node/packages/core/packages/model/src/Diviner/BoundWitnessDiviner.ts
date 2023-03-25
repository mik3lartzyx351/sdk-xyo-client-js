import { AbstractDiviner } from '@xyo-network/diviner'
import { Query } from '@xyo-network/module-model'
import { Payload } from '@xyo-network/payload-model'

import { BoundWitnessDivinerPredicate } from './BoundWitnessDivinerPredicate'

export type BoundWitnessQuerySchema = 'network.xyo.diviner.boundwitness.query'
export const BoundWitnessQuerySchema: BoundWitnessQuerySchema = 'network.xyo.diviner.boundwitness.query'

export type BoundWitnessConfigSchema = 'network.xyo.diviner.boundwitness.config'
export const BoundWitnessConfigSchema: BoundWitnessConfigSchema = 'network.xyo.diviner.boundwitness.config'

export type BoundWitnessQueryPayload = Query<{ schema: BoundWitnessQuerySchema } & BoundWitnessDivinerPredicate>
export const isBoundWitnessQueryPayload = (x?: Payload | null): x is BoundWitnessQueryPayload => x?.schema === BoundWitnessQuerySchema

export type BoundWitnessDiviner = AbstractDiviner
