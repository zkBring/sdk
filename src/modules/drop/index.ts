import TransgateConnect from "@zkpass/transgate-js-sdk"
import IDropSDK, {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TVerify,
  TVerifyResult,
  TIsTransgateAvailable
} from './types'
import { ValidationError } from '../../errors'
import { errors } from '../../texts'
import * as configs from '../../configs'
import { ethers } from 'ethers'

class Drop implements IDropSDK {
  address: string
  token: string
  amount: bigint
  maxClaims: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number
  transgateModule?: typeof TransgateConnect

  constructor({
    address,
    token,
    amount,
    maxClaims,
    title,
    description,
    zkPassSchemaId,
    zkPassAppId,
    expiration,
    transgateModule
  }: TConstructorArgs) {
    this.address = address
    this.token = token
    this.amount = amount
    this.maxClaims = maxClaims
    this.title = title
    this.description = description
    this.zkPassSchemaId = zkPassSchemaId
    this.zkPassAppId = zkPassAppId
    this.expiration = expiration
    this.transgateModule = transgateModule
  }

  claim: TClaim = async ({
    webProof,
    recipient
  }) => {
    return {
      txHash: '0x8b237c858edfc6c5a05969e17bdcfe060922373c8160011a16a7d8140483a021'
    }
  }

  updateMetadata: TUpdateMetadata = async ({
    title,
    description
  }) => {
    if (!title && !description) throw new ValidationError('title or description needed')
    if (title) this.title = title
    if (description) this.description = description

    return {
      txHash: '0x8b237c858edfc6c5a05969e17bdcfe060922373c8160011a16a7d8140483a021'
    }
  }

  verify: TVerify = async () => {
    const connector = new TransgateConnect(this.zkPassAppId)
    const res = await connector.launch(this.zkPassSchemaId) as TVerifyResult
    return res
  }

  isTransgateAvailable: TIsTransgateAvailable = async () => {
    const connector = new TransgateConnect(this.zkPassAppId)
    return connector.isTransgateAvailable()
  }
}
export default Drop
