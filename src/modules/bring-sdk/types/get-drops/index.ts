import { TDropStatus } from "../../../../types"
import Drop from "../../../drop"

export type TGetDropsArgs = {
  creator?: string
  offset?: number
  limit?: number
  staked?: boolean
  status?: TDropStatus
}

type TGetDropsResponse = {
  drops: Drop[]
  resultSet: {
    total: number
    count: number
    offset: number
  }
}

type TGetDrops = (args: TGetDropsArgs) => Promise<TGetDropsResponse>

export default TGetDrops
