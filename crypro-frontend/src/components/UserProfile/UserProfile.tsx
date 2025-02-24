import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "../PasswordInput/PasswordInput";
import {
  useLazyMeQuery,
  useUpdateUserMutation,
  useUploadImageMutation,
} from "../../services/api";
import { toast } from "react-toastify";

interface UserProfileProps {
  data: {
    _id: string;
    name: string;
    email: string;
    active: boolean;
    role: string;
    imageUrl: string | null;
  };
}

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
});

type FormData = typeof validation.__outputType;

const UserProfile: React.FC<UserProfileProps> = ({ data }) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    data.imageUrl
  );
  const [uploadImage, { isLoading: uploadLoading }] = useUploadImageMutation();
  const [fetchUser] = useLazyMeQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      email: data.email,
      password: "",
      name: data.name,
    },
    resolver: yupResolver(validation),
  });

  // Handle image selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file)); // Show preview
      }
    },
    []
  );

  // Handle image upload
  const handleImageUpload = useCallback(async () => {
    if (!profileImage) return alert("Please select an image first.");
    const id = toast.loading("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", profileImage);
      await uploadImage(formData).unwrap();
      await fetchUser().unwrap();
      toast.dismiss(id);
      toast.success("Upload successful!");
    } catch (error: any) {
      toast.dismiss(id);
      toast.error(error.data || error.message || "something went wrong");
    }
  }, [profileImage, uploadImage, fetchUser]);

  // Handle profile update
  const handleUpdateProfile = useCallback(
    async (updationData: FormData) => {
      const id = toast.loading("loading...");
      const payload = { _id: data._id, ...updationData };
      try {
        await updateUser(payload).unwrap();
        await fetchUser().unwrap();
        toast.dismiss(id);
        toast.success("User updated successfully!");
      } catch (error: any) {
        const validationError = error?.data?.data?.errors?.[0].msg;
        toast.dismiss(id);
        toast.error(
          validationError ?? error?.data?.message ?? "Something went wrong!"
        );
      }
    },
    [data._id, updateUser, fetchUser]
  );

  const avatarUrl = useMemo(() => {
    return (
      previewImage ||
      `https://api.dicebear.com/5.x/initials/svg?seed=${data?.name}}`
    );
  }, [previewImage, data?.name]);

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        mt: "20px",
      }}
    >
      <Grid container spacing={4}>
        {/* Left Side - Profile Image & Details */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Avatar
            src={avatarUrl}
            alt="Profile"
            sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
          />
          <Typography variant="h6">{data.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {data.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {data.role}
          </Typography>
        </Grid>

        {/* Right Side - Form for Updating Profile */}
        <Grid item xs={12} md={8}>
          <input
            accept="image/*"
            type="file"
            id="upload-image"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="upload-image">
            <Button variant="outlined" component="span">
              Choose Image
            </Button>
          </label>
          <Button
            loading={uploadLoading}
            variant="contained"
            color="primary"
            onClick={handleImageUpload}
            sx={{ ml: 2 }}
          >
            Upload
          </Button>

          <Box mt={3}>
            <Box
              gap="8px"
              display="flex"
              flexDirection={"column"}
              component="form"
              onSubmit={handleSubmit(handleUpdateProfile)}
            >
              <TextField
                fullWidth
                type="text"
                placeholder="Name"
                label="Name"
                {...register("name")}
                error={Boolean(errors.name?.message)}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                type="text"
                placeholder="Email"
                label="Email"
                {...register("email")}
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
              />
              <PasswordInput
                fullWidth
                type="password"
                placeholder="Confirm Password"
                label="Confirm password"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                {...register("password")}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isDirty || !isValid}
                loading={isLoading}
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
