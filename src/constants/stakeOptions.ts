import { StakeOptions } from "../types/interface";

export const stakeOptions: StakeOptions[] = [
  {
    title: "10 - 30 days", // 1-10 11 - 20 21 - 30
    percentagePerAnnum: 6, //   2      4      6
  },
  {
    title: "40 - 60 days", // 31 - 40 41 - 50 51 - 60
    percentagePerAnnum: 12, //    8       10      12
  },

  {
    title: "70 - 90 days", // 61 - 70 71 - 80 81 - 90
    percentagePerAnnum: 18, //    14      16     18
  },

  {
    title: "91 days above",
    percentagePerAnnum: 20,
  },
];
