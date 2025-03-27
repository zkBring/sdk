import { ethers, hexlify, toUtf8Bytes } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk"
import IDropSDK, {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TGenerateWebproof,
  TWebproof,
  TIsTransgateAvailable,
  TUpdateWalletOrProvider,
  THasUserClaimed,
  TStop
} from './types'
import { ValidationError } from '../../errors'
import { errors } from '../../texts'
import * as configs from '../../configs'
import { DropERC20 } from '../../abi'
import {
  generateEphemeralKeySig,
  xorAddresses,
  uploadMetadataToIpfs
} from '../../utils'

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
    this._initializeConnection(connection)
  }

  private _initializeConnection = async (connection: ethers.ContractRunner) => {
    this._connection = connection
    this.dropContract = new ethers.Contract(
      this.address,
      DropERC20.abi,
      this._connection
    )
  }

  updateWalletOrProvider: TUpdateWalletOrProvider = async (walletOrProvider) => {
    await this._initializeConnection(walletOrProvider)
    return true
  }

  private canSign(): boolean {
    return typeof (this._connection as ethers.Signer).getAddress === 'function'
  }

  claim: TClaim = async ({ webproof, ephemeralKey, recipient }) => {
    if (!this.canSign()) throw new Error("Cannot send transaction: connection is read-only.")

    const { signature: ephemeralKeySig,
      signer: ephemeralKeyAddress } = generateEphemeralKeySig({ ephemeralKey, recipient })
    const tx = await this.dropContract.claimWithEphemeralKey(
      hexlify(toUtf8Bytes(webproof.taskId)),
      webproof.validatorAddress,
      webproof.uHash,
      webproof.publicFieldsHash,
      recipient, // claimer address
      ephemeralKeyAddress, // ephemeral key address
      ephemeralKeySig,
      webproof.allocatorSignature,
      webproof.validatorSignature
    );
    return {
      txHash: tx.hash,
      waitForClaim: async () => {
        return new Promise(async (resolve, reject) => {
          // Create a filter for the Claimed event.
          // Claimed event signature: event Claimed(address indexed recipient, bytes32 uHash);
          const filter = this.dropContract.filters.Claimed(recipient, null);

          // Define the listener that will handle the event.
          const listener = (event: any) => {
            if (!event.args) {
              return;
            }
            const [_recipient, _uHash] = event.args

            // Verify that the event's uHash matches the expected webproof.uHash.
            if (_uHash !== webproof.uHash) {
              return;
            }
            // Remove the listener when a matching event is captured.
            this.dropContract.off(filter, listener);

            // Resolve with the event data.                        
            resolve(event);
          };

          // Start listening for the Claimed event.
          this.dropContract.on(filter, listener);

          // Add a timeout to reject the promise if no event fires within 10 minutes.
          setTimeout(() => {
            this.dropContract.off(filter, listener);
            reject(new Error("Timeout waiting for Claimed event"));
          }, 600000); // 600,000 ms = 10 minutes
        })
      }
    }
  }

  updateMetadata: TUpdateMetadata = async ({
    title,
    description
  }) => {
    if (!this.canSign()) throw new Error("Cannot send transaction: connection is read-only.")
    if (!title && !description) throw new ValidationError('Title or description needed')
    if (title) this.title = title
    if (description) this.description = description

    const ipfsHash = await uploadMetadataToIpfs({
      title: this.title,
      description: this.description
    })

    const tx = await this.dropContract.updateMetadata(ipfsHash)
    return {
      txHash: tx.hash,
      waitForUpdate: async () => {
        return new Promise(async (resolve, reject) => {
          // Create a filter for the MetadataUpdated event.
          // MetadataUpdated event signature: event MetadataUpdated();
          const filter = this.dropContract.filters.MetadataUpdated(null);

          // Define the listener that will handle the event.
          const listener = (event: any) => {
            this.dropContract.off(filter, listener);
            resolve(event);
          };

          // Start listening for the Stopped event.
          this.dropContract.on(filter, listener);

          // Add a timeout to reject the promise if no event fires within 10 minutes.
          setTimeout(() => {
            this.dropContract.off(filter, listener);
            reject(new Error("Timeout waiting for MetadataUpdated event"));
          }, 600000); // 600,000 ms = 10 minutes
        })
      }
    }
  }

  stop: TStop = async () => {
    if (!this.canSign()) throw new Error("Cannot send transaction: connection is read-only.")
    const tx = await this.dropContract.stop()
    return {
      txHash: tx.hash,
      waitForStop: async () => {
        return new Promise(async (resolve, reject) => {
          // Create a filter for the Stopped event.
          // Stopped event signature: event Stopped();
          const filter = this.dropContract.filters.Stopped();

          // Define the listener that will handle the event.
          const listener = (event: any) => {
            this.dropContract.off(filter, listener);
            resolve(event);
          };

          // Start listening for the Stopped event.
          this.dropContract.on(filter, listener);

          // Add a timeout to reject the promise if no event fires within 10 minutes.
          setTimeout(() => {
            this.dropContract.off(filter, listener);
            reject(new Error("Timeout waiting for Stopped event"));
          }, 600000); // 600,000 ms = 10 minutes
        })
      }
    }
  }

  generateWebproof: TGenerateWebproof = async () => {
    if (!this._transgateModule) throw new Error("Transgate module not provided. Please pass it in the SDK constructor.")

    // we use ephemeral key to be able to use generated webproof 
    // to claim to an address signed by ephemeral key
    // we use signature to prevent front-running of claimer
    const ephemeralKey = ethers.Wallet.createRandom()
    const connector = new this._transgateModule(this.zkPassAppId)

    // we XOR drop contract address with ephemeral key address to
    // prevent re-use of webproofs in other drop contracts 
    const webproofRecipient = xorAddresses(this.address, ephemeralKey.address)

    // generate webproof via zkPass extension
    const webproof = await connector.launch(
      this.zkPassSchemaId,
      webproofRecipient) as TWebproof

    return { webproof, ephemeralKey: ephemeralKey.privateKey }
  }

  isTransgateAvailable: TIsTransgateAvailable = async () => {
    if (!this._transgateModule) throw new Error("Transgate module not provided. Please pass it in the SDK constructor.")
    const connector = new this._transgateModule(this.zkPassAppId)
    return connector.isTransgateAvailable()
  }

  hasUserClaimed: THasUserClaimed = async ({ uHash }) => {
    return this.dropContract.isClaimed(uHash)
  }
}
export default Drop
