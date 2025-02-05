import { User } from "@auth0/auth0-react";

export const isAdminUser = (user: User | undefined): boolean => {
  const namespace = "https://ai-bidder-api.com/";
  return Boolean(user?.[namespace + "roles"]?.includes("ai-bidder"));
};
