import api from "./api";

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface ProfileData {
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  college?: string;
  degree?: string;
  graduation_year?: number;
  cgpa?: number;
  skills?: string;
  experience?: Experience[];
  certifications?: Certification[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  about_me?: string;
  avatar_url?: string;
}

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async (data: ProfileData) => {
  const res = await api.put("/profile", data);
  return res.data;
};
