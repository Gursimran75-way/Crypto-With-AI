import { Box, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../components/UserProfile/UserProfile";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useMeQuery } from "../services/api";
import { setUser } from "../store/reducers/authReducer";

const ProfilePage = () => {
  const { user: data } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    data: userData,
    isLoading,
    isSuccess,
  } = useMeQuery(undefined, { skip: !!data });
  //. !!null → false (query runs)
  //. !!User → true (query skips)

  if (userData && isSuccess) {
    // not needed this as i already have a extra reducer for this
    dispatch(setUser({ user: userData.data }));
  }

  if (isLoading) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6" textAlign="center" color="error">
          {" "}
          Failed to load. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <UserProfile data={data} />
    </Box>
  );
};

export default ProfilePage;
