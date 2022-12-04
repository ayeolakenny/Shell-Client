import dayjs from "dayjs";
import { BigNumber, Contract, Signer } from "ethers";
import { errorToast, successToast } from "../lib/toast";
import { STAKE_DEDUCT_MODE } from "../types/enum";
import { TokenContractInterface } from "../types/interface";
import { toEther } from "../utils/etherConversion";

export const stakeToken = async (
  symbol: string,
  wei: BigNumber,
  bankContract: Contract | undefined,
  signer: Signer,
  stakeDeductMode: string,
  tokenContracts: TokenContractInterface[],
  percentagePerAnnum: number,
  numOfDays: number,
  signerAddress: string
) => {
  const fromBalance =
    stakeDeductMode.toLowerCase() === STAKE_DEDUCT_MODE.BALANCE ? true : false;

  try {
    let tokenContract;
    for (let contract of tokenContracts!) {
      if (contract.symbol === symbol) tokenContract = contract.contract;
    }
    await tokenContract?.connect(signer).approve(bankContract?.address, wei);
    const numAllowance = await tokenContract
      ?.connect(signer)
      .allowance(signerAddress, bankContract?.address);
    console.log(toEther(numAllowance));

    await bankContract
      ?.connect(signer)
      .stakeToken(
        symbol,
        wei,
        percentagePerAnnum,
        dayjs().add(numOfDays, "day").unix(),
        fromBalance
      );

    successToast("Intrest has been paid to your balance");
  } catch (err: any) {
    if (
      err.reason ===
      "execution reverted: ERC20: transfer amount exceeds balance"
    ) {
      errorToast("Insufficient funds");
    }
  }
};
