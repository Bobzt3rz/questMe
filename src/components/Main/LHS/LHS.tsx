import { Inventory } from "@mui/icons-material";
import React from "react";
import { useRecoilValue } from "recoil";
import { navbarState } from "../../../atoms/NavbarAtom";
import Character from "./Character/Character";
import Companions from "./Companions/Companions";

type LHSProps = {};

const LHS: React.FC<LHSProps> = () => {
  const navbarStateValue = useRecoilValue(navbarState);

  return (
    <>
      {navbarStateValue.left == "character" && <Character />}
      {navbarStateValue.left == "companions" && <Companions />}
      {navbarStateValue.left == "inventory" && <Inventory />}
    </>
  );
};
export default LHS;
