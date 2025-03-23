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

type TCreateDropResponse = {
  txHash: string
  waitForDrop: () => Promise<Drop>
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
