import { Outlet } from "react-router";
import Optionnav from "./components/optionNav";

const LeftRoot = () => {
  return (
    <>
      <Outlet />
      <Optionnav />
    </>
  );
};

export default LeftRoot;
