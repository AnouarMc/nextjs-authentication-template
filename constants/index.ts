import { createElement } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";

export const publicRoutes = ["/"];
export const authApiPrefix = "/api/auth/";
export const authRoutesPrefixes = ["/sign-in", "/sign-up"];
export const redirectUrl = "/dashboard/profile";

export const tokenTTLInSeconds = 5 * 60;
export const TWO_FACTOR_COOKIE_NAME = "two_factor";

export const defaultError = {
  success: false,
  errors: [{ name: "root", message: "Something went wrong" }],
};

export const maxFileSize = 1000000;
export const maxFileSizeText = "1 MB";
export const acceptedImageTypes = [
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/jpg",
];

export const providers = [
  {
    provider: "github" as const,
    name: "GitHub",
    icon: createElement(FaGithub),
  },
  {
    provider: "google" as const,
    name: "Google",
    icon: createElement(FcGoogle),
  },
];
