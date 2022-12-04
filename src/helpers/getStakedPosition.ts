import { Contract, Signer } from "ethers";

export const getStakedPosition = async (
  bankContract: Contract,
  signer: Signer,
  number: number
) => {
  try {
    return await bankContract?.connect(signer).getPositionById(number);
  } catch (err: any) {
    console.log(err);
  }
};
