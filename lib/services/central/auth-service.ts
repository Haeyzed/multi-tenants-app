import { apiClient } from "./api-client";
import { User } from "@/types/central/user";

export const login = async (credentials: Pick<User, "email" | "password">) => {
  return apiClient.post<{ user: User; token: string }>("/auth/login", credentials);
};

export const register = async (userInfo: Omit<User, "id">) => {
  return apiClient.post<{ user: User; token: string }>("/auth/register", userInfo);
};

export const logout = async () => {
  return apiClient.post<void>("/auth/logout", {});
};

export const getProfile = async () => {
  return apiClient.get<User>("/auth/me");
};