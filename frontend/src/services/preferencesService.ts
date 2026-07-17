import api from "./api";

export interface CareerPreferencesData {
  preferred_role?: string;
  preferred_industry?: string;
  preferred_location?: string;
  employment_type?: string;
  work_mode?: string;
  salary_expectation?: number;
  skills_interested_in?: string[];
}

export const getPreferences = async () => {
  const res = await api.get("/preferences");
  return res.data;
};

export const updatePreferences = async (data: CareerPreferencesData) => {
  const res = await api.put("/preferences", data);
  return res.data;
};
