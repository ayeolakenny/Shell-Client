import { Contract, Signer } from "ethers";
import { successToast } from "../lib/toast";

export const withdrawStakedTokens = async (
  bankContract: Contract | undefined,
  signer: Signer,
  stakePositionId: number
) => {
  try {
    await bankContract?.connect(signer).withdrawStakedToken(stakePositionId);
    successToast("Balance has been credited successfully");
  } catch (err: any) {
    console.log(err);
  }
};
