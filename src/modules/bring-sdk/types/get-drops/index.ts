import { TDrop } from "../../../../types"

export type TGetDropsArgs = {
  creator: string
}

type TGetDropsResponse = TDrop[]

type TGetDrops = (args: TGetDropsArgs) => Promise<TGetDropsResponse>

export default TGetDrops