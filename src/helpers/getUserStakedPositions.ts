import { Contract, Signer } from "ethers";
import { getStakedPosition } from "./getStakedPosition";
import { toEther } from "../utils/etherConversion";
import { UserStakedPositions } from "../types/interface";

export const getUserStakedPositions = async (
  bankContract: Contract | undefined,
  signer: Signer
) => {
  const parsedUserStakes: UserStakedPositions[] = [];
  try {
    const stakePositionsIds = await bankContract
      ?.connect(signer)
      .getPositionIdsForAddress();
    if (stakePositionsIds.length > 0) {
      stakePositionsIds.map(async (id: any) => {
        const stakedPosition = await getStakedPosition(
          bankContract!,
          signer,
          Number(id)
        );
        parsedUserStakes.push({
          positionId: Number(stakedPosition.positionId),
          tokenName: stakedPosition.symbol,
          amount: toEther(stakedPosition.amount),
          percentagePerAnnum: Number(stakedPosition.percentagePerAnnum),
          createdDate: Number(stakedPosition.createdDate),
          expire: Number(stakedPosition.expire),
          open: stakedPosition.open,
        });
      });
    }

    console.log(parsedUserStakes);
    return parsedUserStakes;
  } catch (err: any) {
    console.log(err);
  }
};
