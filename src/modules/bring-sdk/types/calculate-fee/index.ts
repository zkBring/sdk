type TCalculateFeeArgs = {
  amount: bigint
  claims: bigint
}

type TCalculateFeeResponse = {
  amount: bigint
  totalAmount: bigint
  feeAmount: bigint
  fee: number
}

type TCalculateFee = ({
  amount,
  claims
}: TCalculateFeeArgs) => Promise<TCalculateFeeResponse>

export default TCalculateFee