import { ethers } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk"
import BringSDK from '../..'
type TInitializeArgs = {
  walletOrProvider: ethers.ContractRunner,
  transgateModule?: typeof TransgateConnect
}

type TInitializeResponse = BringSDK


type TInitialize = (args: TInitializeArgs) => Promise<TInitializeResponse>

export default TInitialize
