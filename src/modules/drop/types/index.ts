import TClaim from './claim'
import TConstructorArgs from './constructor-args'
import TUpdateMetadata from './update-metadata'
import TVerify from './verify'
import TIsTransgateAvailable from './is-transgate-available'

interface IDrop {
  claim: TClaim
  updateMetadata: TUpdateMetadata
  verify: TVerify
  isTransgateAvailable: TIsTransgateAvailable
}

export {
  TClaim,
  TConstructorArgs,
  TUpdateMetadata,
  TVerify,
  TIsTransgateAvailable
}

export default IDrop
