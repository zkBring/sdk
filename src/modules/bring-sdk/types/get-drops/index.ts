import { TDrop } from "../../../../types"

export type TGetDropsArgs = {
  creator: string
}

type TGetDropsResponse = {
  drops: TDrop[]
}

type TGetDrops = (args: TGetDropsArgs) => Promise<TGetDropsResponse>

export default TGetDrops