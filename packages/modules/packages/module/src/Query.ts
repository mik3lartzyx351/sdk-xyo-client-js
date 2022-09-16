import { XyoPayload } from '@xyo-network/payload'

export type XyoQuery<T extends XyoPayload = XyoPayload> = XyoPayload<
  T & {
    /** @field The maximum XYO that can be spent executing the query */
    budget?: number

    /** @field The frequency on which this query can be rerun */
    maxFrequency?: 'once' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

    /** @field The starting point for the bidding on the query */
    minBid?: number

    /** @field The addresses of the intended handlers */
    address?: string | [string]
  }
>
