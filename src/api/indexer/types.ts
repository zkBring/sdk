type TUploadDropMetadataResponse = {
  success: boolean,
  metadataIpfsHash: string
}

type TUploadDropMetadata = (
  apiHost: string,
  apiKey: string | null,
  title: string,
  description?: string
) => Promise<TUploadDropMetadataResponse>


export type TRequests = {
  uploadDropMetadata: TUploadDropMetadata
}
