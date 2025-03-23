export type TClaimResponse = {
  txHash: string
}

type TClaim = () => Promise<TClaimResponse>

export default TClaim
