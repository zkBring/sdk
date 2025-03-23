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
import { ethers } from 'ethers'

import * as configs from '../../configs'
import { DropFactory } from '../../abi'

class BringSDK implements IBringSDK {

  connection: ethers.ContractRunner
  fee: number
  dropFactory: ethers.Contract

  constructor({
    walletOrProvider
  }: TConstructorArgs) {
    this.connection = walletOrProvider
    this.dropFactory = new ethers.Contract(configs.BASE_SEPOLIA_DROP_FACTORY, DropFactory.abi, this.connection)
    this.getFee()
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
    return {
      txHash: '0x237737d56da9036c528064e52fa0d4d97ce5bf30e4740556f8b3c47f5b9332e1',
      waitForDrop: new Promise((
        resolve,
        reject
      ) => {
        setTimeout(() => {
          resolve(
            new Drop({
              token,
              amount,
              maxClaims,
              title,
              description,
              zkPassSchemaId,
              zkPassAppId,
              expiration
            })
          )
        }, 2000)
      })
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
