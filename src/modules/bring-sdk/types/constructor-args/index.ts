import { ethers } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk"

type TConstructorArgs = {
  walletOrProvider: ethers.ContractRunner
  transgateModule?: typeof TransgateConnect
  address?: string
  chainId: bigint
}

export default TConstructorArgs
