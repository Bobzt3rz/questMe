import { atom } from "recoil";

export interface DesiredChainIdState {
  id: string;
}

const defaultDesiredChainState: DesiredChainIdState = {
  id: "0x61",
};

export const desiredChainIdState = atom<DesiredChainIdState>({
  key: "desiredChainIdState",
  default: defaultDesiredChainState,
});
