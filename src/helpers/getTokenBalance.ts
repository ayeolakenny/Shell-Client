import { Contract, Signer } from "ethers";
import { toEther } from "../utils/etherConversion";

export const getTokenBalance = async (
  symbol: string,
  signer: Signer,
  bankContract: Contract | undefined
) => {
  const balance = await bankContract?.connect(signer).getTokenBalance(symbol);
  return toEther(balance);
};
