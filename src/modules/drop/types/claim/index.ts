export type TClaimArgs = {
  webProof: string
  recipient: string
}

export type TClaimResponse = {
  txHash: string
}

type TClaim = ({ webProof, recipient }: TClaimArgs) => Promise<TClaimResponse>

export default TClaim