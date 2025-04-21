import { ethers, hexlify, toUtf8Bytes } from 'ethers'
import TransgateConnect from "@zkpass/transgate-js-sdk";
import IBringSDK, {
  TConstructorArgs,
  TCreateDrop,
  TCalculateFee,
  TGetFee,
  TUpdateWalletOrProvider,
  TGetDrop,
  TGetDrops
} from './types'
import Drop from '../drop'
import { TConstructorArgs as TDropConstructorArgs } from '../drop/types'
import * as configs from '../../configs'
import { DropFactory } from '../../abi'
import { indexerApi, TDropData, TDropDataWithFetcher } from '../../api'

class BringSDK implements IBringSDK {
  connection: ethers.ContractRunner
  fee: number
  dropFactory: ethers.Contract
  transgateModule?: typeof TransgateConnect

  // #TODO: set API url and API key from constructor args 
  private _indexerApiUrl: string
  private _indexerApiKey: string | null

  constructor({
    walletOrProvider,
    transgateModule
  }: TConstructorArgs) {
    this.transgateModule = transgateModule
    this._initializeConnection(walletOrProvider)
    this.getFee()

    this._indexerApiUrl = configs.BASE_SEPOLIA_INDEXER_API_URL
  }

  private _initializeConnection = (walletOrProvider: ethers.ContractRunner) => {
    this.connection = walletOrProvider
    this.dropFactory = new ethers.Contract(
      configs.BASE_SEPOLIA_DROP_FACTORY,
      DropFactory.abi,
      this.connection
    )
  }

  private canSign(): boolean {
    return typeof (this.connection as ethers.Signer).getAddress === 'function'
  }

  createDrop: TCreateDrop = async ({
    token,
    amount,
    maxClaims,
    title,
    description,
    zkPassSchemaId,
    zkPassAppId,
    expiration
  }) => {
    const schemaIdHex = hexlify(toUtf8Bytes(zkPassSchemaId))
    const { metadataIpfsHash } = await indexerApi.uploadDropMetadata(
      this._indexerApiUrl,
      this._indexerApiKey,
      title,
      description
    )

    if (!this.connection) {
      throw new Error('Signer is not provided')
    }

    const connectedAddress = this.canSign() ? await (this.connection as ethers.Signer).getAddress() : undefined

    const { hash: txHash } = await this.dropFactory.createDrop(
      token,
      amount,
      maxClaims,
      schemaIdHex,
      expiration,
      metadataIpfsHash
    );
    return {
      txHash,
      waitForDrop: async () => {
        return new Promise(async (resolve, reject) => {

          // Note: DropCreated indexes only the first three parameters (creator, drop, token).
          // We filter by creator; drop and token are left as null (wildcards).
          const filter = this.dropFactory.filters.DropCreated(
            connectedAddress,
            null,
            null
          );
          // The event parameters follow the event signature:
          // (creator, dropAddress, token, amount, maxClaims, zkPassSchemaId, expiration, metadataIpfsHash)
          const listener = (event: any) => {
            if (!event.args) {
              return;
            }
            // Destructure the event arguments. They are in order as defined in the event.
            const [
              _creator,
              _dropAddress,
              _tokenParam,
              _amountParam,
              _maxClaimsParam,
              _zkPassSchemaId,
              _expiration,
              _metadataIpfsHash
            ] = event.args;

            // verify the emitted metadataIpfsHash
            if (_metadataIpfsHash !== metadataIpfsHash) {
              return;
            }

            // Remove the listener once the event is correctly captured.
            this.dropFactory.off(filter, listener);
            const drop = new Drop({
              token,
              amount,
              maxClaims,
              title,
              description,
              zkPassSchemaId,
              zkPassAppId,
              expiration,
              address: _dropAddress,
              transgateModule: this.transgateModule,
              connection: this.connection,
              indexerApiUrl: this._indexerApiUrl,
              indexerApiKey: this._indexerApiKey,
              creatorAddress: _creator,
              status: 'active'
            })
            resolve({
              drop,
              event
            });
          };

          // Start listening for the DropCreated event with the filter.
          this.dropFactory.on(filter, listener);

          // add a timeout so the promise rejects if the event never fires.
          setTimeout(() => {
            this.dropFactory.off(filter, listener);
            reject(new Error("Timeout waiting for DropCreated event"));
          }, 600000); // Timeout after 10 minutes.
        });
      }
    }
  }

  updateWalletOrProvider: TUpdateWalletOrProvider = async (walletOrProvider) => {
    this._initializeConnection(walletOrProvider)
    return true
  }

  getFee: TGetFee = async () => {
    if (!this.fee) {
      this.fee = Number(await this.dropFactory.fee()) / 10000
    }
    return {
      fee: this.fee
    }
  }

  calculateFee: TCalculateFee = async ({
    amount, // atomic value
    maxClaims
  }) => {
    const { fee } = await this.getFee()
    const totalClaimsAmount = amount * maxClaims
    const feeBasisPoints = BigInt(fee * 10000)
    const feeAmount = totalClaimsAmount * feeBasisPoints / BigInt(10000)
    const totalAmount = feeAmount + totalClaimsAmount
    return {
      amount,
      totalAmount,
      feeAmount,
      fee
    }
  }

  private _convertDropData(dropData: TDropData | TDropDataWithFetcher) {
    let dropParams: TDropConstructorArgs = {
      ...dropData,
      address: dropData.dropAddress,
      token: dropData.tokenAddress,
      amount: BigInt(dropData.amount),
      maxClaims: BigInt(dropData.maxClaims),
      expiration: Number(dropData.expiration),
      connection: this.connection,
      claimsCount: BigInt(dropData.claimsCount),
      transgateModule: this.transgateModule,
      indexerApiUrl: this._indexerApiUrl,
      indexerApiKey: this._indexerApiKey,

      // #TODO: fetch from API
      zkPassAppId: '0acb96f1-6e0d-4414-a744-96f2620a6682'
    }

    // If dropData includes fetcherData, set it as connected user data 
    if ('fetcherData' in dropData && dropData.fetcherData) {
      dropParams = {
        ...dropParams,
        connectedUserAddress: dropData.fetcherData.accountAddress,
        hasConnectedUserClaimed: dropData.fetcherData.claimed,
        connectedUserClaimTxHash: dropData.fetcherData.claimTxHash
      };
    }
    return new Drop(dropParams)
  }

  getDrop: TGetDrop = async (
    dropAddress,
    userAddress
  ) => {
    
    const connectedAddress = userAddress || (this.canSign() ? await (this.connection as ethers.Signer).getAddress() : undefined)

    const { drop: dropData } = await indexerApi.getDrop(
      this._indexerApiUrl,
      this._indexerApiKey,
      dropAddress,
      connectedAddress
    )

    return this._convertDropData(dropData)

  }

  getDrops: TGetDrops = async ({
    creator,
    offset,
    limit,
    staked,
    listed,
    status
  }) => {
    const { dropsArray, resultSet } = await indexerApi.getDrops(
      this._indexerApiUrl,
      this._indexerApiKey,
      creator,
      offset,
      limit,
      status,
      listed,
      staked
    )
    return {
      drops: dropsArray.map(drop => this._convertDropData(drop)),
      resultSet
    }
  }
}

export default BringSDK
