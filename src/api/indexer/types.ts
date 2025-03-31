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

type TGetDropResponse = {
  success: boolean;
  drop: {
    id: string;
    dropAddress: string;
    factoryAddress: string;
    tokenAddress: string;
    creatorAddress: string;
    zkPassSchemaId: string;
    amount: string;
    expiration: string;
    maxClaims: string;
    metadataIpfsHash: string;
    status: string;
    blockTimestamp: string;
    fetcherData?: {
      accountAddress: string;
      claimed: boolean;
      claimTxHash: string | null;
    };
  };
};

type TGetDropsResponse = {
  success: boolean;
  drops_array: {
    id: string;
    drop_address: string;
    factory_address: string;
    token_address: string;
    creator_address: string;
    zk_pass_schema_id: string;
    amount: string;
    expiration: string;
    max_claims: string;
    metadata_ipfs_hash: string;
    status: string;
    block_timestamp: string;
  }[];
  result_set: {
    offset: number;
    total: number;
    count: number;
  };
};

type TGetDropClaimerResponse = {
  success: boolean;
  account_address: string;
  claimed: boolean;
  claim_tx_hash: string;
};

type TGetDrop = (
  apiHost: string,
  apiKey: string | null,
  dropAddress: string,
  fetchAs?: string
) => Promise<TGetDropResponse>

type TGetDrops = (
  apiHost: string,
  apiKey: string | null,
  creatorAddress?: string
) => Promise<TGetDropsResponse>

type TGetDropClaimer = (
  apiHost: string,
  apiKey: string | null,
  dropAddress: string,
  claimerAddress: string
) => Promise<TGetDropClaimerResponse>

export type TRequests = {
  uploadDropMetadata: TUploadDropMetadata
  getDrop: TGetDrop
  getDrops: TGetDrops
  getDropClaimer: TGetDropClaimer
}
