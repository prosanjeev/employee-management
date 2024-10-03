import React from "react";
import TopNav from "./header/TopNav";
import { Outlet } from "react-router-dom";
import SideNav from "./sidenav/SideNav";
import { Box } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

const DashboardLayout = () => {
  return (
    <>
      <TopNav />
      {/* <SideNav /> */}
      <Box width='86vw' mx='auto' >
      <Outlet />
      <ToastContainer />
      </Box>
    </>
  );
};

export default DashboardLayout;
