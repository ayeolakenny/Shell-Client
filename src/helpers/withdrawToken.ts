import { BigNumber, Contract, Signer } from "ethers";
import { errorToast } from "../lib/toast";

export const withdrawTokens = async (
  wei: BigNumber,
  symbol: string,
  bankContract: Contract | undefined,
  signer: Signer
) => {
  try {
    if (symbol === "Matic") {
      await bankContract?.connect(signer).withdrawMatic(wei);
    } else {
      await bankContract?.connect(signer).withdrawTokens(wei, symbol);
    }
  } catch (err: any) {
    if (err.error.data.message === "execution reverted: Insufficient funds") {
      errorToast("Insufficient funds");
    }
  }
};
