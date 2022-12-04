import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { getSigner } from "./getSigner";
import { getTokenBalances } from "./getTokenBalances";
import { getUserStakedPositions } from "./getUserStakedPositions";

export const connect = async () => {
  const {
    provider,
    setSignerAddress,
    setSigner,
    bankContract,
    tokenSymbols,
    setTokenBalances,
    tokenBalances,
    setShowTransactionModal,
    setShowStakingModal,
    setTransactionType,
    setUserStakedPositions,
  } = useContext(AppContext);

  const currentSigner = await getSigner(provider);
  const signerAddress = await currentSigner?.getAddress();
  setSignerAddress(signerAddress!);
  setSigner(currentSigner);
  const allBalances = await getTokenBalances(
    currentSigner!,
    bankContract,
    tokenSymbols
  );
  setTokenBalances(allBalances);

  const userStakedPositions = await getUserStakedPositions(
    bankContract,
    currentSigner!
  );
  setUserStakedPositions(userStakedPositions!);
};
