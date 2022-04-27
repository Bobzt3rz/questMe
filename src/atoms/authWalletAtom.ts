import { atom } from "recoil";

export interface AuthWalletState {
  open: boolean;
  wallet: "unconnected" | "connected";
}

const defaultWalletState: AuthWalletState = {
  open: false,
  wallet: "unconnected",
};

export const authWalletState = atom<AuthWalletState>({
  key: "authWalletState",
  default: defaultWalletState,
});
