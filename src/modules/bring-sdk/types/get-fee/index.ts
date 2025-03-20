type TGetFeeResponse = {
  fee: number
}

type TGetFee = () => Promise<TGetFeeResponse>

export default TGetFee