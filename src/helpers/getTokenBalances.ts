import { Contract, Signer } from "ethers";
import { getTokenBalance } from "./getTokenBalance";

export const getTokenBalances = async (
  signer: Signer,
  bankContract: Contract | undefined,
  tokenSymbols: string[] | undefined
) => {
  const allBalances: { symbol: string; balance: number }[] = [];
  for (let tokenSymbol of tokenSymbols!) {
    const balance = await getTokenBalance(tokenSymbol, signer, bankContract);
    allBalances.push({ symbol: tokenSymbol, balance: Number(balance) });
  }
  return allBalances;
};
