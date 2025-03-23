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

  constructor({
    walletOrProvider
  }: TConstructorArgs) {
    this.connection = walletOrProvider
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
    const factory = new ethers.Contract(configs.BASE_SEPOLIA_DROP_FACTORY, DropFactory.abi, this.connection)
    return {
      fee: configs.FEE
    }
  }


  calculateFee: TCalculateFee = async ({
    amount, // atomic value
    maxClaims
  }) => {
    const totalClaimsAmount = amount * maxClaims
    const feeAmount = totalClaimsAmount / BigInt(100) * BigInt(configs.FEE * 100)
    const totalAmount = feeAmount + totalClaimsAmount
    return {
      amount,
      totalAmount: totalAmount,
      feeAmount,
      fee: configs.FEE
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
