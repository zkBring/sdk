import Drop from "../../../drop"

type TCreateDropArgs = {
  token: string
  amount: bigint
  maxClaims: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number
}

type TWaitForDropResponse = {
  drop: Drop,
  event: any
}

type TCreateDropResponse = {
  txHash: string
  waitForDrop: () => Promise<TWaitForDropResponse>
}

type TCreateDrop = ({
  token,
  amount,
  maxClaims,
  title,
  description,
  zkPassSchemaId,
  zkPassAppId,
  expiration
}: TCreateDropArgs) => Promise<TCreateDropResponse>

export default TCreateDrop
