import { useAppSelector } from "../store/store";
import { Navigate } from "react-router-dom";

const NotFound = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  } else {
    return <Navigate to={"/auth"} />;
  }
};

export default NotFound;
