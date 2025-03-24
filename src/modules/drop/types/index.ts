import TClaim from './claim'
import TConstructorArgs from './constructor-args'
import TUpdateMetadata from './update-metadata'
import TGenerateWebproof, { TWebproof } from './generate-webproof'
import TIsTransgateAvailable from './is-transgate-available'

interface IDrop {
  claim: TClaim
  updateMetadata: TUpdateMetadata
  generateWebproof: TGenerateWebproof
  isTransgateAvailable: TIsTransgateAvailable
}

export {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TGenerateWebproof,
  TWebproof,
  TIsTransgateAvailable
}

export default IDrop
