import { ReactNode } from "react";
import { Contract } from "ethers";

export interface AppContextProviderProps {
  children: ReactNode;
}

export interface TokenBalanceInterface {
  symbol: string;
  balance: number;
}

export interface TokenContractInterface {
  symbol: string;
  contract: Contract;
}

export interface StakeOptions {
  title: string;
  percentagePerAnnum: number;
}

export interface UserStakedPositions {
  positionId: number;
  tokenName: string;
  amount: string;
  percentagePerAnnum: number;
  createdDate: number;
  expire: number;
  open: boolean;
}
