/**
 * @jest-environment jsdom
 */

import { XyoAccount } from '@xyo-network/account'
import { XyoPayloadPluginResolver } from '@xyo-network/payload-plugin'

import { XyoElevationPayloadPlugin } from './Plugin'
import { XyoElevationSchema } from './Schema'

describe('XyoLocationPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const resolver = new XyoPayloadPluginResolver().register(XyoElevationPayloadPlugin(), {
      witness: { account: new XyoAccount(), geolocation: navigator.geolocation },
    })
    expect(resolver.resolve({ schema: XyoElevationSchema })).toBeObject()
    expect(resolver.witness(XyoElevationSchema)).toBeObject()
  })
})
