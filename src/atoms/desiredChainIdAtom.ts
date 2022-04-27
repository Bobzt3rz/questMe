import { atom } from "recoil";

export interface DesiredChainIdState {
  id: number;
}

const defaultDesiredChainState: DesiredChainIdState = {
  id: 1,
};

export const desiredChainIdState = atom<DesiredChainIdState>({
  key: "desiredChainIdState",
  default: defaultDesiredChainState,
});
