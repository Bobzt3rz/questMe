import { atom } from "recoil";

export interface NavbarState {
  left: "character" | "inventory" | "companions";
  right: "my_quests" | "world_quests";
}

const defaultNavbarState: NavbarState = {
  left: "character",
  right: "my_quests",
};

export const navbarState = atom<NavbarState>({
  key: "navbarState",
  default: defaultNavbarState,
});
