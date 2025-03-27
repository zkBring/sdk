import { ethers } from "ethers"

export type TXorAddresses = (
  address1: string,
  address2: string
) => string


const xorAddresses: TXorAddresses = (address1, address2) => {
  // Remove the "0x" prefix if it exists
  const addr1 = address1.startsWith("0x") ? address1.slice(2) : address1;
  const addr2 = address2.startsWith("0x") ? address2.slice(2) : address2;

  if (addr1.length !== 40 || addr2.length !== 40) {
    throw new Error("Invalid address length");
  }

  // Convert the hex strings to BigInts and perform XOR
  const resultBigInt = BigInt("0x" + addr1) ^ BigInt("0x" + addr2);

  // Convert back to hex, pad to 40 hex characters, and add "0x" prefix
  let resultHex = resultBigInt.toString(16);
  resultHex = resultHex.padStart(40, "0");

  return "0x" + resultHex;
}


export default xorAddresses

