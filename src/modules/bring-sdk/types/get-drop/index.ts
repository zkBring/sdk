import { TDrop } from "../../../../types"


type TGetDropResponse = TDrop

type TGetDrop = (
  dropAddress: string
) => Promise<TGetDropResponse>

export default TGetDrop