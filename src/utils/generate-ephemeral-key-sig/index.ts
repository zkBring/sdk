import { ethers } from "ethers"

export type TGenerateEphemeralKeySigArgs = {
  ephemeralKey: string;
  recipient: string;
};

export type TGenerateEphemeralKeySigResponse = {
  signature: string;
  signer: string;
};

export type TGenerateEphemeralKeySig = (
  args: TGenerateEphemeralKeySigArgs
) => TGenerateEphemeralKeySigResponse;

const generateEphemeralKeySig: TGenerateEphemeralKeySig = ({ ephemeralKey, recipient }) => {
  const wallet = new ethers.Wallet(ephemeralKey)
  const abiCoder = new ethers.AbiCoder();
  const encodedParams = abiCoder.encode(
    ['address'],
    [recipient]
  );
  const dataHash = ethers.keccak256(encodedParams);
  const messageHash = ethers.hashMessage(ethers.getBytes(dataHash));
  const splitSig = wallet.signingKey.sign(messageHash);
  const signature = ethers.Signature.from(splitSig).serialized
  return { signature, signer: wallet.address }
}

export default generateEphemeralKeySig
