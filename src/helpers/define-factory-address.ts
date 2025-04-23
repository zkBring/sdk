import * as configs from '../configs'

type TDefineFacrtoryAddress = (chainId: bigint) => string

const defineFacrtoryAddress: TDefineFacrtoryAddress = (
  chainId
) => {
  switch (chainId) {
    case BigInt(84532):
      return configs.BASE_SEPOLIA_DROP_FACTORY
    default:
      return configs.BASE_DROP_FACTORY
  }
}

export default defineFacrtoryAddress