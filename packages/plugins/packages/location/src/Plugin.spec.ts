/**
 * @jest-environment jsdom
 */

import { XyoPayloadPluginResolver } from '@xyo-network/payload-plugin'

import { XyoLocationPayloadPlugin } from './Plugin'
import { XyoLocationSchema } from './Schema'
import { XyoLocationWitnessConfigSchema } from './Witness'

describe('XyoLocationPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const resolver = new XyoPayloadPluginResolver().register(XyoLocationPayloadPlugin(), {
      witness: {
        config: {
          geolocation: navigator.geolocation,
          schema: XyoLocationWitnessConfigSchema,
          targetSchema: XyoLocationSchema,
        },
      },
    })
    expect(resolver.resolve({ schema: XyoLocationSchema })).toBeObject()
    expect(resolver.witness(XyoLocationSchema)).toBeObject()
  })
})
