import * as configs from '../configs'

type TDefineZkPassAppId = (chainId: bigint) => string

const defineZkPassAppId: TDefineZkPassAppId = (
  chainId
) => {
  switch (chainId) {
    case BigInt(84532):
      return configs.TESTNET_ZK_PASS_PROJECT_ID
    case BigInt(8453):
    default:
      return configs.MAINNET_ZK_PASS_PROJECT_ID
  }
}

export default defineZkPassAppId