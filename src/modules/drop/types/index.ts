import TClaim from './claim'
import TConstructorArgs from './constructor-args'
import TUpdateMetadata from './update-metadata'
import TGenerateWebproof, { TWebproof } from './generate-webproof'
import TIsTransgateAvailable from './is-transgate-available'
import THasUserClaimed from './has-user-claimed'
import TUpdateWalletOrProvider from "./update-wallet-or-provider"

interface IDrop {
  claim: TClaim
  updateMetadata: TUpdateMetadata
  generateWebproof: TGenerateWebproof
  isTransgateAvailable: TIsTransgateAvailable
  hasUserClaimed: THasUserClaimed
  updateWalletOrProvider: TUpdateWalletOrProvider
}

export {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TGenerateWebproof,
  TWebproof,
  TIsTransgateAvailable,
  THasUserClaimed,
  TUpdateWalletOrProvider
}

export default IDrop
