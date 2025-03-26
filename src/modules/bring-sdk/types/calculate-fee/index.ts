type TCalculateFeeArgs = {
  amount: bigint
  maxClaims: bigint
}

type TCalculateFeeResponse = {
  amount: bigint
  totalAmount: bigint
  feeAmount: bigint
  fee: number
}

type TCalculateFee = ({
  amount,
  maxClaims
}: TCalculateFeeArgs) => Promise<TCalculateFeeResponse>

export default TCalculateFee
