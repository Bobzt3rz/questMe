import { atom } from "recoil";

export interface RewardModalState {
  open: boolean;
  view: "reward";
  token: "YME";
  number: number;
}

const defaultModalState: RewardModalState = {
  open: false,
  view: "reward",
  token: "YME",
  number: 0,
};

export const rewardModalState = atom<RewardModalState>({
  key: "rewardModalState",
  default: defaultModalState,
});
