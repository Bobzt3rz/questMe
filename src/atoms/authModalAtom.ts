import { atom } from "recoil";

export interface AuthModalState {
  open: boolean;
  view: "chooseWallet";
}

const defaultModalState: AuthModalState = {
  open: false,
  view: "chooseWallet",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});
