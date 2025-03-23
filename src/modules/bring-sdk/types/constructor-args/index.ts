import { ethers } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk";

type TConstructorArgs = {
  walletOrProvider: ethers.ContractRunner,
  transgateModule?: typeof TransgateConnect
}

export default TConstructorArgs
