import Drop from "../../../drop"

type TCreateDropArgs = {
  token: string
  amount: bigint
  claims: bigint
  title: string
  description: string
  zkPassSchemaId: string
  zkPassAppId: string
  expiration: number
}

type TCreateDropResponse = {
  txHash: string
  waitForDrop: Promise<Drop>
}

type TCreateDrop = ({
  token,
  amount,
  claims,
  title,
  description,
  zkPassSchemaId,
  zkPassAppId,
  expiration
}: TCreateDropArgs) => Promise<TCreateDropResponse>

export default TCreateDrop