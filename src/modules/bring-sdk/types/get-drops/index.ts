import Drop from "../../../drop"

export type TGetDropsArgs = {
  creator?: string
}

type TGetDropsResponse = Drop[]

type TGetDrops = (args: TGetDropsArgs) => Promise<TGetDropsResponse>

export default TGetDrops
