import TConstructorArgs from './constructor-args'
import TCreateDrop from './create-drop'
import TGetFee from './get-fee'
import TCalculateFee from './calculate-fee'
import TGetDrop from './get-drop'
import TGetDrops from './get-drops'
import TUpdateWalletOrProvider from "./update-wallet-or-provider"
import TInitialize from './initialize'

interface IBringSDK {
  createDrop: TCreateDrop
  getFee: TGetFee
  calculateFee: TCalculateFee
  getDrop: TGetDrop
  getDrops: TGetDrops
  updateWalletOrProvider: TUpdateWalletOrProvider
}

export {
  TConstructorArgs,
  TCreateDrop,
  TCalculateFee,
  TGetFee,
  TGetDrop,
  TGetDrops,
  TInitialize,
  TUpdateWalletOrProvider
}

export default IBringSDK
