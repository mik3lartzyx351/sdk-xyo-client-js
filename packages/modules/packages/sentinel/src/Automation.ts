import { AnyObject } from '@xyo-network/core'
import { Payload } from '@xyo-network/payload-model'

export type SentinelAutomationSchema = 'network.xyo.automation'
export const SentinelAutomationSchema: SentinelAutomationSchema = 'network.xyo.automation'

export type SentinelBaseAutomationPayload<T extends AnyObject = AnyObject> = Payload<
  T & {
    schema: SentinelAutomationSchema
    type?: 'interval' | 'change'
    /** @field The list of witnesses to invoke [all if undefined] */
    witnesses?: string[]
  }
>

export type SentinelIntervalAutomationPayload = SentinelBaseAutomationPayload<{
  /** @field epoch after which any reoccurrence stops */
  end?: number

  /** @field time between triggers [non-repeating if undefined] */
  frequency?: number

  /** @field units for frequency field [hour if undefined] */
  frequencyUnits?: 'second' | 'minute' | 'hour' | 'day'

  /** @field remaining triggers [infinite if undefined] */
  remaining?: number

  /** @field epoch of the next trigger */
  start: number

  type: 'interval'
}>

export type SentinelChangeAutomationPayload = SentinelBaseAutomationPayload<{
  type: 'change'
}>

export type SentinelAutomationPayload = SentinelIntervalAutomationPayload | SentinelChangeAutomationPayload
