import { ethers } from "ethers";

export const getSigner = async (
  provider: ethers.providers.Web3Provider | undefined
): Promise<any> => {
  await provider?.send("eth_requestAccounts", []);
  const signer = provider?.getSigner();
  return signer;
};
