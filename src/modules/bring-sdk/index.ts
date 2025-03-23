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

  constructor({
    walletOrProvider
  }: TConstructorArgs) {
    this.connection = walletOrProvider
    if (this.canSign()) {
      const signerProvider = (this.connection as ethers.Signer).provider;
      if (!signerProvider) {
        throw new Error("Signer does not have an associated provider");
      }
      this.provider = signerProvider;
    } else {
      this.provider = this.connection as ethers.Provider;
    }
    this.dropFactory = new ethers.Contract(
      configs.BASE_SEPOLIA_DROP_FACTORY,
      DropFactory.abi,
      this.connection
    )
    this.getFee()
  }

  private canSign(): boolean {
    return typeof (this.connection as ethers.Signer).getAddress === 'function';
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
    const schemaIdHex = hexlify(toUtf8Bytes(zkPassSchemaId));
    const metadataIpfsHash = ethers.encodeBytes32String("metadata");

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
        // Wait for the transaction receipt using the txHash
        const receipt = await this.provider.waitForTransaction(txHash);
        if (!receipt) {
          throw new Error("Transaction dropped.");
        }

        // Create an Interface instance for your dropFactory ABI
        const dropFactoryInterface = new ethers.Interface(DropFactory.abi);

        // Parse the logs to find the "DropCreated" event
        const dropCreatedEvent = receipt.logs
          .map((log) => {
            try {
              return dropFactoryInterface.parseLog(log);
            } catch (error) {
              return null;
            }
          })
          .find((parsedLog) => parsedLog && parsedLog.name === "DropCreated");

        if (!dropCreatedEvent) {
          throw new Error("DropCreated event not found in transaction logs");
        }

        // Extract the drop contract address from the parsed event arguments
        const dropAddress = dropCreatedEvent.args.drop;

        const drop = new Drop({
          address: dropAddress,
          token,
          amount,
          maxClaims,
          title,
          description,
          zkPassSchemaId,
          zkPassAppId,
          expiration
        })
        return drop
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
