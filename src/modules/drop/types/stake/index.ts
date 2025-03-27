type TWaitForStakeResponse = {
  event: any
}

export type TStakeResponse = {
  txHash: string
  waitForStake: () => Promise<TWaitForStakeResponse>
}

type TStake = (amount: string) => Promise<TStakeResponse>

export default TStake
