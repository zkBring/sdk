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
import {
  drop
} from '../../mocks'
import Drop from '../drop'
import * as configs from '../../configs'
import { DropFactory } from '../../abi'
import { uploadMetadataToIpfs } from '../../utils'

class BringSDK implements IBringSDK {
  connection: ethers.ContractRunner
  fee: number
  dropFactory: ethers.Contract
  connectedAddress: string | null
  transgateModule?: typeof TransgateConnect

  constructor({
    walletOrProvider,
    transgateModule
  }: TConstructorArgs) {
    this.transgateModule = transgateModule
    this._initializeConnection(walletOrProvider)
    this.getFee()
  }

  private _initializeConnection = async (walletOrProvider: ethers.ContractRunner) => {
    this.connection = walletOrProvider
    this.dropFactory = new ethers.Contract(
      configs.BASE_SEPOLIA_DROP_FACTORY,
      DropFactory.abi,
      this.connection
    )
    if (this.canSign()) {
      await this.getConnectedAddress()
    }
  }

  private getConnectedAddress = async () => {
    this.connectedAddress = await (this.connection as ethers.Signer).getAddress()
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
    const metadataIpfsHash = await uploadMetadataToIpfs({ title, description })

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
            this.connectedAddress,
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
              connection: this.connection
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
    await this._initializeConnection(walletOrProvider)
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

  getDrop: TGetDrop = async (
    dropAddress
  ) => {
    const dropData = {
      address: dropAddress,
      token: '0xaebd651c93cd4eae21dd2049204380075548add5',
      expiration: 1742477528995,
      zkPassSchemaId: 'c38b96722bd24b64b8d349ffd6391a8c',
      zkPassAppId: '6543a426-2afe-4efa-9d23-2d6ce8723e23',
      maxClaims: BigInt('10'),
      amount: BigInt('100000'),
      title: 'Hello',
      description: ' world!',
      connection: this.connection,
      transgateModule: this.transgateModule
    }
    const drop = new Drop(dropData)
    return drop
  }

  getDrops: TGetDrops = async ({
    creator
  }) => {
    return [
      drop
    ]
  }
}

export default BringSDK
