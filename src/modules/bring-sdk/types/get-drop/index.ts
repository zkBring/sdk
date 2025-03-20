import { TDrop } from "../../../../types"


type TGetDropResponse = {
  drop: TDrop
}

type TGetDrop = (
  dropAddress: string
) => Promise<TGetDropResponse>

export default TGetDrop