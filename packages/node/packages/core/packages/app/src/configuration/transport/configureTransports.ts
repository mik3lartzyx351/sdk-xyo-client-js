import { MemoryNode } from '@xyo-network/node'

import { NodeConfigurationFunction } from '../../model'
import { configureExpressHttpTransport, configureFileTransport } from './providers'

export const configureTransports: NodeConfigurationFunction = async (node: MemoryNode) => {
  await configureFileTransport(node)
  await configureExpressHttpTransport(node)
}
