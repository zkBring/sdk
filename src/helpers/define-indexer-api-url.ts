import * as configs from '../configs'

type TDefineIndexerApiUrl = (chainId: bigint) => string

const defineIndexerApiUrl: TDefineIndexerApiUrl = (
  chainId
) => {
  switch (chainId) {
    case BigInt(84532):
      return configs.BASE_SEPOLIA_INDEXER_API_URL
    default:
      return configs.BASE_INDEXER_API_URL
  }
}

export default defineIndexerApiUrl