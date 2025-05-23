import { TWebproof } from "../"

export type TClaimArgs = {
  webproof: TWebproof
  ephemeralKey: string
  recipient: string
}

type TWaitForClaimResponse = boolean

export type TClaimResponse = {
  txHash: string
  waitForClaim: () => Promise<TWaitForClaimResponse>
}

type TClaim = ({ webproof, ephemeralKey, recipient }: TClaimArgs) => Promise<TClaimResponse>

export default TClaim
