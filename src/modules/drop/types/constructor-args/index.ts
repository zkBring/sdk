
import { ethers } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk"
import {
  TDropStatus
} from '../../../../types'

type TConstructorArgs = {
  address: string
  token: string
  amount: bigint
  maxClaims: bigint
  claimsCount?: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number
  connection: ethers.ContractRunner
  transgateModule?: typeof TransgateConnect,
  indexerApiUrl: string
  indexerApiKey: string | null
  connectedUserAddress?: string
  hasConnectedUserClaimed?: boolean
  connectedUserClaimTxHash?: string | null
  creatorAddress: string
  decimals?: number
  symbol?: string

  status: TDropStatus
}


export default TConstructorArgs
