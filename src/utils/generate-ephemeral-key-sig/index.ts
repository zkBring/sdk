import { ethers } from "ethers"

export type TGenerateEphemeralKeySigArgs = {
  ephemeralKey: string;
  recipient: string;
};

export type TGenerateEphemeralKeySig = (
  args: TGenerateEphemeralKeySigArgs
) => Promise<string>;

const generateEphemeralKeySig: TGenerateEphemeralKeySig = async ({ ephemeralKey, recipient }) => {
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
  return signature
}

export default generateEphemeralKeySig
