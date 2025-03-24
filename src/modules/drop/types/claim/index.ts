import { TWebproof } from "../"

export type TClaimArgs = {
  webproof: TWebproof
  ephemeralKey: string
  recipient: string
}

export type TClaimResponse = {
  txHash: string
}

type TClaim = ({ webproof, ephemeralKey, recipient }: TClaimArgs) => Promise<TClaimResponse>

export default TClaim
