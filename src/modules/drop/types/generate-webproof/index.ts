import { ethers } from 'ethers'
export type TWebproof = {
  allocatorAddress: string;
  allocatorSignature: string;
  publicFields: any[];
  publicFieldsHash: string;
  taskId: string;
  uHash: string;
  validatorAddress: string;
  validatorSignature: string;
  recipient?: string;
}

export type TGenerateWebproofResponse = {
  webproof: TWebproof;
  ephemeralKey: ethers.Signer;
};

type TGenerateWebproof = () => Promise<TGenerateWebproofResponse>

export default TGenerateWebproof

