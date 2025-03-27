type TWaitForStopResponse = {
  event: any
}

export type TStopResponse = {
  txHash: string
  waitForStop: () => Promise<TWaitForStopResponse>
}

type TStop = () => Promise<TStopResponse>

export default TStop
