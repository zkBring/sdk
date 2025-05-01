import { EChain } from "../types"

export default {
  'chain_not_supported': () => `Chain is not supported. Please use ${Object.keys(EChain).filter(item => isNaN(Number(item))).join(', ')}`,
  'argument_not_provided': (argumentName: string, currentValue: string) => `Argument "${argumentName}" is not provided (argument="${argumentName}", value="${currentValue}")`,
  'property_not_provided': (propertyName: string, currentValue: string) => `Property "${propertyName}" is not provided (property="${propertyName}", value="${currentValue}")`,
}