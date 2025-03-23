import { ethers } from 'ethers'

type TConstructorArgs = {
  walletOrProvider: ethers.ContractRunner
}

export default TConstructorArgs



// const bringSDK = new BringSDK(wallet) 

// const { fee } = bringSDK.getFee() 
// const { amount, totalAmount, feeAmount, fee } = bringSDK.calculateFee(amount, maxClaims)

// const dropParams = { token, amount, claims, title, description, zkPassSchemaId, zkPassAppId }
// const { txHash, waitForDrop } = await bringSDK.createDrop(dropParams)
// // update UI here..
// const drop = await waitForDrop()



// DROP PAGE
// const drops = await bringSDK.getDrops()
// const drops = await bringSDK.getDrops({ creator: wallet.address })
// // const drop = await bringSDK.getDrop(dropAddress)

// // const { txHash } = await drop.updateMetadata({ title, description })

// const isAvailable = await bringSDK.isTransgateAvailable()
// const webproof = await drop.verify()

// const claimParams = { webProof, recipient }
// const { txHash }  = await drop.claim(claimParams)
