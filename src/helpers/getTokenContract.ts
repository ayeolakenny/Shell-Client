import { ethers } from "ethers";

import shellArtifact from "../artifacts/contracts/Shell.sol/Shell.json";
import linkArtifact from "../artifacts/contracts/Link.sol/Link.json";
import usdtArtifact from "../artifacts/contracts/Usdt.sol/Usdt.json";
import bnbArtifact from "../artifacts/contracts/Bnb.sol/Bnb.json";

export const getTokenContract = async (
  symbol: string,
  bankContract: ethers.Contract,
  provider: ethers.providers.Web3Provider
) => {
  const address = await bankContract
    .connect(provider)
    .getWhitelistedTokenAddress(symbol);
  const abi =
    symbol === "Shell"
      ? shellArtifact.abi
      : symbol === "Link"
      ? linkArtifact.abi
      : symbol === "Usdt"
      ? usdtArtifact.abi
      : bnbArtifact.abi;

  const tokenContract = new ethers.Contract(address, abi);
  return tokenContract;
};
