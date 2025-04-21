import Drop from "../../../drop"

type TGetDrop = (
  dropAddress: string,
  userAddress?: string
) => Promise<Drop>

export default TGetDrop
