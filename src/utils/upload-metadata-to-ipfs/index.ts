export type TUploadMetadataToIpfsArgs = {
  title: string;
  description: string;
};

export type TUploadMetadataToIpfs = (
  args: TUploadMetadataToIpfsArgs
) => Promise<string>

const uploadMetadataToIpfs: TUploadMetadataToIpfs = ({ title, description }) => {
  const ipfsHash = "bafkreicqtmmxcbjclaf35wsvrncf3nyhmu3m4i7e56hl6dpe5hyuapmlfy"
  return Promise.resolve(ipfsHash)
}

export default uploadMetadataToIpfs

