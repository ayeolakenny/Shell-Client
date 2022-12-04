import { BigNumber, Contract, Signer } from "ethers";
import { errorToast } from "../lib/toast";
import { TokenContractInterface } from "../types/interface";

export const depositTokens = async (
  wei: BigNumber,
  symbol: string,
  signer: Signer,
  bankContract: Contract | undefined,
  tokenContracts: TokenContractInterface[],
  signerAddress: string
) => {
  if (symbol === "Matic") {
    try {
      await signer?.sendTransaction({
        to: bankContract?.address,
        value: wei,
      });
    } catch (err: any) {
      if (err.data.message.includes("insufficient funds")) {
        errorToast("Insufficient funds");
      }
    }
  } else {
    try {
      let tokenContract;
      for (let contract of tokenContracts!) {
        if (contract.symbol === symbol) tokenContract = contract.contract;
      }
      await tokenContract?.connect(signer).approve(bankContract?.address, wei);
      await tokenContract
        ?.connect(signer)
        .allowance(signerAddress, bankContract?.address);
      await bankContract?.connect(signer).depositTokens(wei, symbol);
    } catch (err: any) {
      if (
        err.reason ===
        "execution reverted: ERC20: transfer amount exceeds balance"
      ) {
        errorToast("Insufficient funds");
      }
    }
  }
};
