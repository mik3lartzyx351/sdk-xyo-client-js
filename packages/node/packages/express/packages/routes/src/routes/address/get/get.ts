import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ModuleWrapper } from '@xyo-network/module'
import { Module } from '@xyo-network/module-model'
import { trimAddressPrefix } from '@xyo-network/node-core-lib'
import { XyoPayload } from '@xyo-network/payload-model'
import { RequestHandler } from 'express'

import { AddressPathParams } from '../AddressPathParams'

const handler: RequestHandler<AddressPathParams, XyoPayload[]> = async (req, res, next) => {
  const { address } = req.params
  const { node } = req.app
  if (address) {
    let modules: Module[] = []
    const normalizedAddress = trimAddressPrefix(address).toLowerCase()
    if (node.address === normalizedAddress) modules = [node]
    else {
      const byAddress = await node.downResolver.resolve({ address: [normalizedAddress] })
      if (byAddress.length) modules = byAddress
      else {
        const byName = await node.downResolver.resolve({ name: [address] })
        if (byName.length) modules = byName
      }
    }
    if (modules.length) {
      const wrapper = ModuleWrapper.wrap(modules[0])
      res.json(await wrapper.discover())
      return
    }
  }
  next('route')
}

export const getAddress = asyncHandler(handler)
