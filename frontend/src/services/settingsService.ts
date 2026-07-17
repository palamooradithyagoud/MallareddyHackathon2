import api from "./api";

export interface UserSettingsData {
  theme?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  language?: string;
  privacy_profile_public?: boolean;
}

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettings = async (data: UserSettingsData) => {
  const res = await api.put("/settings", data);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/settings/account");
  return res.data;
};
