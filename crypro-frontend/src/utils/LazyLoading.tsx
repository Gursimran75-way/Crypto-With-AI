import { Box, CircularProgress } from "@mui/material";
import { Suspense, ComponentType } from "react";

const Loadable = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense
      fallback={
        <Box
          width="100vw"
          height="100%"
          padding={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;