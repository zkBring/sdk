import EChain from './chain'
import TDropStatus from './drop-status'

type TDrop = {
  id: string
  contract: string
  token: string
  expiration: number
  creator: string
  chain: EChain  // only Base Sepolia for now 84532
  factory: string
  metadataIpfsHash: string
  zkPassSchemaId: string
  maxClaims: bigint
  amount: bigint
  status: TDropStatus
}

export default TDrop