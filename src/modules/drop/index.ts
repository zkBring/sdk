import IDropSDK, {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TVerify
} from './types'

import { ValidationError } from '../../errors'

import { errors } from '../../texts'
import * as configs from '../../configs'
import { ethers } from 'ethers'

class Drop implements IDropSDK {
  token: string
  amount: bigint
  claims: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number

  constructor({
    token,
    amount,
    claims,
    title,
    description,
    zkPassSchemaId,
    zkPassAppId,
    expiration
  }: TConstructorArgs) {
    this.token = token
    this.amount = amount
    this.claims = claims
    this.title = title
    this.description = description
    this.zkPassSchemaId = zkPassSchemaId
    this.zkPassAppId = zkPassAppId
    this.expiration = expiration
  }


  claim: TClaim = async ({
    webProof,
    recipient
  }) => {
    return {
      txHash: '0x8b237c858edfc6c5a05969e17bdcfe060922373c8160011a16a7d8140483a021'
    }
  }

  updateMetadata: TUpdateMetadata = async () => {
    return {
      txHash: '0x8b237c858edfc6c5a05969e17bdcfe060922373c8160011a16a7d8140483a021'
    }
  }

  verify: TVerify = async () => {
    return {
      webProof: 'xxx'
    }
  }
  
}
export default Drop
