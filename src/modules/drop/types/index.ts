import TClaim from './claim'
import TStop from './stop'
import TStake from './stake'
import TConstructorArgs from './constructor-args'
import TUpdateMetadata from './update-metadata'
import TGenerateWebproof, { TWebproof } from './generate-webproof'
import TIsTransgateAvailable from './is-transgate-available'
import THasUserClaimed from './has-user-claimed'
import TGetStakedAmount from './get-staked-amount'
import TUpdateWalletOrProvider from "./update-wallet-or-provider"


interface IDrop {
  claim: TClaim
  stop: TStop
  stake: TStake
  updateMetadata: TUpdateMetadata
  generateWebproof: TGenerateWebproof
  isTransgateAvailable: TIsTransgateAvailable
  hasUserClaimed: THasUserClaimed
  updateWalletOrProvider: TUpdateWalletOrProvider
  getStakedAmount: TGetStakedAmount
}

export {
  TClaim,
  TStop,
  TStake,
  TConstructorArgs,
  TUpdateMetadata,
  TGenerateWebproof,
  TWebproof,
  TIsTransgateAvailable,
  THasUserClaimed,
  TUpdateWalletOrProvider,
  TGetStakedAmount
}

export default IDrop
