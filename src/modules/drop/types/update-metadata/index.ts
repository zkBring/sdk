export type TUpdateMetadataArgs = {
  title?: string
  description?: string
}

type TWaitForUpdateResponse = {
  event: any
}

export type TUpdateMetadataResponse = {
  txHash: string,
  waitForUpdate: () => Promise<TWaitForUpdateResponse>
}

type TUpdateMetadata = (args: TUpdateMetadataArgs) => Promise<TUpdateMetadataResponse>

export default TUpdateMetadata
