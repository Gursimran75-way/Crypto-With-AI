import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLazyMeQuery, useLoginMutation } from "../../services/api";
import PasswordInput from "../PasswordInput/PasswordInput";
import { motion } from "motion/react";

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
});

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      flex: 1,
      mx: "auto",
    },
    input: {
      mt: 2,
    },
    button: {
      my: 2,
    },
    link: {
      color: theme.palette.primary.main,
    },
  });

type FormData = typeof validation.__outputType;

export default function LoginForm() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [loginUser, { isLoading }] = useLoginMutation();
  const [fetchMe] = useLazyMeQuery();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    const toastID = toast.loading("Loading..., please wait");
    try {
      await loginUser(data).unwrap();
      await fetchMe();
      toast.dismiss(toastID);
      toast.success("User logged in successfully!");
      navigate("/app");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.dismiss(toastID);
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
      navigate("/app");
    }
  };

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={ {"width": "100%"}}
      >
        <Card variant="outlined" sx={style.root}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <Typography variant="h4" component="h1">
                  <b>Welcome!</b>
                </Typography>
                <Typography my={1}>Sign in to continue.</Typography>
              </Box>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TextField
                  sx={style.input}
                  fullWidth
                  type="text"
                  placeholder="Email"
                  label="Email"
                  {...register("email")}
                  error={Boolean(errors.email?.message)}
                  helperText={errors.email?.message}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <PasswordInput
                  sx={style.input}
                  fullWidth
                  type="password"
                  placeholder="password"
                  label="password"
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                  {...register("password")}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  loading={isLoading}
                  sx={style.button}
                  variant="contained"
                  fullWidth
                  disabled={!isValid}
                >
                  Log In
                </Button>
              </motion.div>
              <Typography>
                Don&apos;t have an account?{" "}
                <NavLink
                  style={style.link as CSSProperties}
                  to="/auth/register"
                >
                  Sign up
                </NavLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
