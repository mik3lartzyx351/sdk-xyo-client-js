import { InfuraProvider } from '@ethersproject/providers'
import { EthereumGasEthersSchema } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { EthereumGasEthersWitnessConfigSchema } from './Schema'
import { EthereumGasEthersWitness } from './Witness'

const projectId = process.env.INFURA_PROJECT_ID || ''
const projectSecret = process.env.INFURA_PROJECT_SECRET || ''

import { testIf } from '@xylabs/jest-helpers'

describe('EthereumGasEthersWitness', () => {
  testIf(projectId && projectSecret)('returns observation', async () => {
    const provider = new InfuraProvider('homestead', { projectId: process.env.INFURA_PROJECT_ID, projectSecret })
    const sut = await EthereumGasEthersWitness.create({
      config: {
        schema: EthereumGasEthersWitnessConfigSchema,
      },
      provider,
    })
    const [actual] = await sut.observe()
    expect(actual.timestamp).toBeNumber()
    expect(actual.schema).toBe(EthereumGasEthersSchema)
    const answerWrapper = PayloadWrapper.wrap(actual)
    expect(await answerWrapper.getValid()).toBe(true)
  })
})
