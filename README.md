# 🧰 zkBring SDK

The `zkbring-sdk` allows you to create and manage privacy-preserving ZK-powered token drops using [Transgate](https://zkpass.xyz) and zkPass verification.

---

## 📦 Installation

Install the SDK using **Yarn**:

```bash
yarn add zkbring-sdk
```

---

## 🔧 Importing the SDK

```ts
import {
  BringSDK,
  Drop
} from 'zkbring-sdk'
```

---

## 🚀 Getting Started

### Initialize the SDK

```ts
const sdk = new BringSDK({
  walletOrProvider: signer, // optional, required for creating or claiming a drop
  transgateModule: transgateModule // optional, for zkPass functionality, required for claiming a drop
})
```

---

### Token Approval (Before Creating a Drop)

Before creating a drop, make sure the drop factory is approved to transfer tokens on behalf of the user.

```ts
const fees = await sdk.calculateFee({
  amount: tokensPerClaim, // BigInt
  maxClaims: totalClaims // BigInt
})

const {
  amount,        // BigInt
  totalAmount,   // BigInt
  feeAmount,     // BigInt
  fee            // number
} = fees

const contractInstance = new ethers.Contract('0x...', ERC20Contract.abi, signer)

const iface = new ethers.Interface(ERC20Contract.abi);
const data = iface.encodeFunctionData('approve', [
  dropFactoryBaseSepoliaAddress,
  String(totalAmount)
])

await signer.sendTransaction({
  to: '0x...',    // token address
  from: '0x...',  // user address
  value: 0,
  data
})
```

---

### Create a Drop

```ts
const { txHash, waitForDrop } = await sdk.createDrop({
  token: '0x...',
  expiration: 1742477528995, // timestamp in milliseconds
  zkPassSchemaId: 'string',
  zkPassAppId: 'string',
  maxClaims: BigInt('10'),
  amount: ethers.parseUnits('10', decimals),
  title: 'My title',
  description: 'Description'
})
```

Use `waitForDrop()` to wait until the drop is fully deployed.

---

### Get Drop Instance

To retrieve an existing drop by its ID and user address:

```ts
const sdk = new BringSDK({});
const drop = await sdk.getDrop(
  <DROP_ID>,
  '0x...' // address of connected user if available. Can be useful to retrieve data for SSR
)
```

---

### Verify User with zkPass (Before Claiming)

```ts
const isTransgateAvailable = await drop.isTransgateAvailable();

if (isTransgateAvailable) {
  const result = await drop.generateWebproof();
  const { webproof, ephemeralKey } = result;
}
```

---

### Update Wallet or Provider (Before Claiming)

```ts
drop.updateWalletOrProvider(signer)
```

---

### Claim the Drop

```ts
const isClaimed = await drop.hasUserClaimed({ uHash: webproof.uHash })

if (!isClaimed) {
  const { txHash, waitForClaim } = await drop.claim({ webproof, ephemeralKey })

  console.log("Claimed at:", txHash)

  await waitForClaim()
}
```

---

### Additional Claim Checks (Optional)

If `walletOrProvider` was provided during SDK init or if signer was passed to drop via updateWalletOrProvider method:

```ts
const isClaimed = drop.hasConnectedUserClaimed; // boolean | undefined

if (isClaimed) {
  const txHash = drop.connectedUserClaimTxHash; // string | undefined
}
```

---

## 🧪 Full Example

```ts
import {
  BringSDK,
  Drop
} from 'zkbring-sdk';

const sdk = new BringSDK({ walletOrProvider: signer, transgateModule });

// Approve tokens before creating a drop
const fees = await sdk.calculateFee({
  amount: BigInt("10"),
  maxClaims: BigInt("100")
})

const { totalAmount } = fees

const contractInstance = new ethers.Contract('0x...', ERC20Contract.abi, signer);
const iface = new ethers.Interface(ERC20Contract.abi)
const data = iface.encodeFunctionData('approve', [
  dropFactoryBaseSepoliaAddress,
  String(totalAmount)
])

await signer.sendTransaction({
  to: '0x...',
  from: '0x...',
  value: 0,
  data
})

// Create the drop
const { txHash, waitForDrop } = await sdk.createDrop({
  token: '0x...',
  expiration: 1742477528995,
  zkPassSchemaId: '...',
  zkPassAppId: '...',
  maxClaims: BigInt("100"),
  amount: ethers.parseUnits("10", 18),
  title: "My First Drop",
  description: "Claim tokens with ZK verification"
})

await waitForDrop()

const drop = await sdk.getDrop(dropId, connectedAddress)

if (await drop.isTransgateAvailable()) {
  const { webproof, ephemeralKey } = await drop.generateWebproof()

  drop.updateWalletOrProvider(signer)

  const hasClaimed = await drop.hasUserClaimed({ uHash: webproof.uHash })

  if (!hasClaimed) {
    const { txHash, waitForClaim } = await drop.claim({ webproof, ephemeralKey })
    console.log("Drop claimed in tx:", txHash)
    await waitForClaim()
  }
}
```
