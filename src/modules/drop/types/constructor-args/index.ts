import { ethers } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk";

type TConstructorArgs = {
  address: string
  token: string
  amount: bigint
  maxClaims: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number
  connection: ethers.ContractRunner
  transgateModule?: typeof TransgateConnect
}


export default TConstructorArgs
