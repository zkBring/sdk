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

export interface TDropData {
  title: string;
  description: string;
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
  claimsCount: string
  decimals: number
  symbol: string
}

export interface TDropDataWithFetcher extends TDropData {
  fetcherData?: {
    accountAddress?: string;
    claimed?: boolean;
    claimTxHash?: string | null;
  };
}

type TGetDropResponse = {
  success: boolean;
  drop: TDropDataWithFetcher;
};

type TGetDropsResponse = {
  success: boolean;
  dropsArray: TDropData[];
  resultSet: {
    offset: number;
    total: number;
    count: number;
  };
};

type TGetDropClaimerResponse = {
  success: boolean;
  accountAddress: string;
  claimed: boolean;
  claimTxHash: string;
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
  creatorAddress?: string,
  offset?: number,
  limit?: number
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
