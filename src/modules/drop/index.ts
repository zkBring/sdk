import { ethers, hexlify, toUtf8Bytes } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk"
import IDropSDK, {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TGenerateWebproof,
  TWebproof,
  TIsTransgateAvailable
} from './types'
import { ValidationError } from '../../errors'
import { errors } from '../../texts'
import * as configs from '../../configs'
import { DropERC20 } from '../../abi'
import { generateEphemeralKeySig } from '../../utils'

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
  dropContract: ethers.Contract

  private _connection: ethers.ContractRunner
  private _transgateModule?: typeof TransgateConnect

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
    connection,
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
    this._transgateModule = transgateModule
    this._connection = connection

    this.dropContract = new ethers.Contract(
      this.address,
      DropERC20.abi,
      this._connection
    )
  }

  private canSign(): boolean {
    return typeof (this._connection as ethers.Signer).getAddress === 'function'
  }

  claim: TClaim = async ({ webproof, ephemeralKey, recipient }) => {
    if (!this.canSign()) throw new Error("Cannot send transaction: connection is read-only.")

    const ephemeralKeySig = await generateEphemeralKeySig({ ephemeralKey, recipient })
    console.log({ ephemeralKeySig })

    const tx = await this.dropContract.claimWithEphemeralKey(
      hexlify(toUtf8Bytes(webproof.taskId)),
      webproof.validatorAddress,
      webproof.uHash,
      webproof.publicFieldsHash,
      recipient, // recipient
      webproof.recipient, // ephemeral key address
      ephemeralKeySig,
      webproof.allocatorSignature,
      webproof.validatorSignature
    );

    console.log({ tx })

    return {
      txHash: tx.hash
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

  generateWebproof: TGenerateWebproof = async () => {
    if (!this._transgateModule) throw new Error("Transgate module not provided. Please pass it in the SDK constructor.")
    // store the ephemeral key to use at claim to prevent frontrunning    
    const ephemeralKey = ethers.Wallet.createRandom()
    const connector = new this._transgateModule(this.zkPassAppId)
    const webproof = await connector.launch(
      this.zkPassSchemaId,
      ephemeralKey.address) as TWebproof

    return { webproof, ephemeralKey: ephemeralKey.privateKey }
  }

  isTransgateAvailable: TIsTransgateAvailable = async () => {
    if (!this._transgateModule) throw new Error("Transgate module not provided. Please pass it in the SDK constructor.")
    const connector = new this._transgateModule(this.zkPassAppId)
    return connector.isTransgateAvailable()
  }
}
export default Drop
