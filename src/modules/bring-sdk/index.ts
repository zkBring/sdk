import IBringSDK, {
  TConstructorArgs,
  TCreateDrop,
  TCalculateFee,
  TGetFee,
  TGetDrop,
  TGetDrops,
  TIsTransgateAvailable
} from './types'
import {
  drop
} from '../../mocks'

import Drop from '../drop'
import { ethers, hexlify, toUtf8Bytes } from 'ethers'

import * as configs from '../../configs'
import { DropFactory } from '../../abi'

class BringSDK implements IBringSDK {
  connection: ethers.ContractRunner
  fee: number
  dropFactory: ethers.Contract
  provider: ethers.Provider
  connectedAddress: string | null

  constructor({
    walletOrProvider
  }: TConstructorArgs) {
    this.connection = walletOrProvider
    if (this.canSign()) {
      const signerProvider = (this.connection as ethers.Signer).provider;
      if (!signerProvider) {
        throw new Error("Signer does not have an associated provider")
      }
      this.provider = signerProvider
      this.getConnectedAddress()
    } else {
      this.provider = this.connection as ethers.Provider
    }
    this.dropFactory = new ethers.Contract(
      configs.BASE_SEPOLIA_DROP_FACTORY,
      DropFactory.abi,
      this.connection
    )
    this.getFee()
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
    const metadataIpfsHash = ethers.encodeBytes32String("metadata")

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

            resolve(
              new Drop({
                token,
                amount,
                maxClaims,
                title,
                description,
                zkPassSchemaId,
                zkPassAppId,
                expiration,
                address: _dropAddress
              })
            );
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
    return drop
  }

  getDrops: TGetDrops = async ({
    creator
  }) => {
    return [
      drop
    ]
  }

  isTransgateAvailable: TIsTransgateAvailable = async () => {
    return true
  }
}

export default BringSDK
