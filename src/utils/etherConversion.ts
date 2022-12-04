import { ethers } from "ethers";

// convert from ether to wei
export const toWei = (ether: string) => ethers.utils.parseEther(ether);

// convert from wei to ether
export const toEther = (wei: string) =>
  ethers.utils.formatEther(wei).toString();
