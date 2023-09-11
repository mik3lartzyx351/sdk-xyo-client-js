import { HDWallet } from '@xyo-network/account'
import { CryptoNftCollectionWitness } from '@xyo-network/crypto-nft-collection-witness-plugin'
import { CryptoWalletNftWitness } from '@xyo-network/crypto-nft-witness-wallet-plugin'
import { ImageThumbnailWitness } from '@xyo-network/image-thumbnail-plugin'
import { CreatableModuleDictionary, ModuleFactory } from '@xyo-network/module-model'
import { TYPES, WALLET_PATHS } from '@xyo-network/node-core-types'
import { PrometheusNodeWitness } from '@xyo-network/prometheus-node-plugin'
import { TimestampWitness, TimestampWitnessConfigSchema } from '@xyo-network/witness-timestamp'
import { Container } from 'inversify'

const getWallet = (container: Container) => {
  const mnemonic = container.get<string>(TYPES.AccountMnemonic)
  return HDWallet.fromMnemonic(mnemonic)
}

const getCryptoWalletNftWitness = () => {
  return new ModuleFactory(CryptoWalletNftWitness, { config: { schema: CryptoWalletNftWitness.configSchema } })
}

const getCryptoNftCollectionWitness = () => {
  return new ModuleFactory(CryptoNftCollectionWitness, { config: { schema: CryptoNftCollectionWitness.configSchema } })
}

const getImageThumbnailWitness = () => {
  return new ModuleFactory(ImageThumbnailWitness, { config: { schema: ImageThumbnailWitness.configSchema } })
}

const getPrometheusNodeWitness = () => {
  return new ModuleFactory(PrometheusNodeWitness, { config: { schema: PrometheusNodeWitness.configSchema } })
}

const getTimestampWitness = async (container: Container) => {
  const wallet = await getWallet(container)
  return new ModuleFactory(TimestampWitness, {
    config: {
      accountDerivationPath: WALLET_PATHS.Witnesses.TimestampWitness,
      name: TYPES.TimestampWitness.description,
      schema: TimestampWitnessConfigSchema,
    },
    wallet,
  })
}

export const addWitnessModuleFactories = async (container: Container) => {
  const dictionary = container.get<CreatableModuleDictionary>(TYPES.CreatableModuleDictionary)
  dictionary[CryptoNftCollectionWitness.configSchema] = getCryptoNftCollectionWitness()
  dictionary[CryptoWalletNftWitness.configSchema] = getCryptoWalletNftWitness()
  dictionary[ImageThumbnailWitness.configSchema] = getImageThumbnailWitness()
  dictionary[PrometheusNodeWitness.configSchema] = getPrometheusNodeWitness()
  dictionary[TimestampWitnessConfigSchema] = await getTimestampWitness(container)
}
