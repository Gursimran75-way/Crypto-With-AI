import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Authlayout = () => {
  return (
    <>
      <CssBaseline />
      <Box
        // display={"flex"}
        // justifyContent={"center"}
        // alignItems={"center"}
        height="100vh"
        width="100vw"
        sx={{
          backgroundColor: "lightgray",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Outlet />
      </Box>
    </>
  );
};

export default Authlayout;
