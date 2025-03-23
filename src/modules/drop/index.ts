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

  // Private property to store the randomly ethemereal key
  private _ephemeralKeySigner?: ethers.Signer
  private _webproof?: TVerifyResult

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

  claim: TClaim = async () => {
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
    // store the ephemeral key to use at claim to prevent frontrunning 
    this._ephemeralKeySigner = ethers.Wallet.createRandom() as ethers.Signer
    const ephemeralKeyAddress = await this._ephemeralKeySigner.getAddress();
    const connector = new TransgateConnect(this.zkPassAppId)
    this._webproof = await connector.launch(
      this.zkPassSchemaId,
      ephemeralKeyAddress) as TVerifyResult
    return this._webproof
  }

  isTransgateAvailable: TIsTransgateAvailable = async () => {
    const connector = new TransgateConnect(this.zkPassAppId)
    return connector.isTransgateAvailable()
  }
}
export default Drop
