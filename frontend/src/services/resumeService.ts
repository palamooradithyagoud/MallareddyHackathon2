import api from "./api";

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version: number;
  name: string;
  file_size: number;
  created_at: string;
}

export interface ResumeData {
  id: string;
  user_id: string;
  name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
  versions: ResumeVersion[];
}

export const getResume = async (): Promise<ResumeData> => {
  const res = await api.get("/resume");
  return res.data;
};

export const uploadResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteResume = async () => {
  const res = await api.delete("/resume");
  return res.data;
};

export const getResumeBlobUrl = async (): Promise<string> => {
  const res = await api.get("/resume/preview", {
    responseType: "blob",
  });
  const file = new Blob([res.data], { type: "application/pdf" });
  return URL.createObjectURL(file);
};

export const getResumeVersionBlobUrl = async (versionId: string): Promise<string> => {
  const res = await api.get(`/resume/version/${versionId}/preview`, {
    responseType: "blob",
  });
  const file = new Blob([res.data], { type: "application/pdf" });
  return URL.createObjectURL(file);
};
