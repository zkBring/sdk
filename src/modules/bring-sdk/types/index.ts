import TConstructorArgs from './constructor-args'
import TCreateDrop from './create-drop'
import TGetFee from './get-fee'
import TCalculateFee from './calculate-fee'
import TGetDrop from './get-drop'
import TGetDrops from './get-drops'
import TIsTransgateAvailable from './is-transgate-available'

interface IBringSDK {
  createDrop: TCreateDrop
  getFee: TGetFee
  calculateFee: TCalculateFee
  getDrop: TGetDrop
  getDrops: TGetDrops
  isTransgateAvailable: TIsTransgateAvailable
}

export {
  TConstructorArgs,
  TCreateDrop,
  TCalculateFee,
  TGetFee,
  TGetDrop,
  TGetDrops,
  TIsTransgateAvailable
}

export default IBringSDK