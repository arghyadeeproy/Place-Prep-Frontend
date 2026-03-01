import api from "./api";

export async function fetchPopularCompanies() {
  const res = await api.get("/placement/popular/");
  return res.data.data; // array of { id, name, color, logo }
}

export async function fetchCompanyGuide(companyId) {
  const res = await api.get(`/placement/company/${companyId}/`);
  return res.data.data;
  // returns full guide: { name, tagline, about, rounds_detail_list,
  //                       syllabus, pyqs, tips, resources, ... }
}

export async function refreshCompanyCache(companyId) {
  await api.delete(`/placement/company/${companyId}/cache/`);
}