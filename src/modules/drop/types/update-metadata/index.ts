export type TUpdateMetadataArgs = {
  title?: string
  description?: string
}

export type TUpdateMetadataResponse = {
  txHash: string
}

type TUpdateMetadata = (args: TUpdateMetadataArgs) => Promise<TUpdateMetadataResponse>

export default TUpdateMetadata