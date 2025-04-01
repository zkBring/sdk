import Drop from "../../../drop"

export type TGetDropsArgs = {
  creator?: string
  offset?: number
  limit?: number
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
