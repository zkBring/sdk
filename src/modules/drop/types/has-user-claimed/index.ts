type THasUserClaimedResponse = boolean

type THasUserClaimedArgs = {
  uHash: string
}
type THasUserClaimed = ({ uHash }: THasUserClaimedArgs) => Promise<THasUserClaimedResponse>

export default THasUserClaimed
