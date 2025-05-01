# 🧰 zkBring SDK

The `zkbring-sdk` allows you to create and manage privacy-preserving ZK-powered token drops using [Transgate](https://zkpass.xyz) and zkPass verification.

---

## Installation

Install the SDK using **Yarn**:

```bash
yarn add zkbring-sdk
```

---

## 🔧 Importing the SDK and TransgateConnect

```ts
import TransgateConnect from "@zkpass/transgate-js-sdk"
import {
  BringSDK
} from 'zkbring-sdk'
```

---

## Getting Started

### Initialize the SDK

```ts

const sdk = await BringSDK.initialize({
  walletOrProvider: signer, // optional, required for claiming a drop
  transgateModule // optional, for zkPass functionality, required for claiming a drop
})
```


### Get Drop Instance

To retrieve an existing drop by its ID and user address:

```ts
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

## Full Example (Claim flow)

```ts
import {
  BringSDK,
  Drop
} from 'zkbring-sdk'

const sdk = await BringSDK.initialize({ walletOrProvider: signer, transgateModule })

const drop = await sdk.getDrop(dropId, '0x...')

if (await drop.isTransgateAvailable()) {
  const { webproof, ephemeralKey } = await drop.generateWebproof()

  // not needed if signer was passed initially to SDK instance
  drop.updateWalletOrProvider(signer)

  const hasClaimed = await drop.hasUserClaimed({ uHash: webproof.uHash })

  if (!hasClaimed) {
    const { txHash, waitForClaim } = await drop.claim({ webproof, ephemeralKey })
    console.log("Drop claimed in tx:", txHash)
    await waitForClaim()
  }
}
```
