export type TVerifyResponse = {
  webProof: string
}

type TVerify = () => Promise<TVerifyResponse>

export default TVerify