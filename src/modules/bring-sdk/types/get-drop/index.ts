import Drop from "../../../drop"

type TGetDrop = (
  dropAddress: string
) => Promise<Drop>

export default TGetDrop
