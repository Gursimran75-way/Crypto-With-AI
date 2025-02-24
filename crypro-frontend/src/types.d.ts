declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface User {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  role: "USER" | "ADMIN";
  createdAt: string,
  updatedAt: string;
  imageUrl: string
}

interface ApiResponse<T> {
  data: T;
  message: string;
  sucess: boolean
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  AccessToken: string;
  refreshToken: string;
}

type RefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};