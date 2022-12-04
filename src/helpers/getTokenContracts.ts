import { Contract, providers } from "ethers";
import { getTokenContract } from "./getTokenContract";

export const getTokenContracts = async (
  symbols: string[],
  bankContract: Contract,
  provider: providers.Web3Provider
) => {
  const allTokenContracts: { symbol: string; contract: Contract }[] = [];
  for (let symbol of symbols) {
    const contract = await getTokenContract(symbol, bankContract, provider);
    allTokenContracts.push({ symbol, contract });
  }
  return allTokenContracts;
};
