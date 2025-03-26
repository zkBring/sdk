import { ethers } from 'ethers'

type TUpdateWalletOrProviderArgs = {
  walletOrProvider: ethers.ContractRunner
}


type TUpdateWalletOrProvider = (TUpdateWalletOrProviderArgs) => Promise<bool>

export default TUpdateWalletOrProvider
