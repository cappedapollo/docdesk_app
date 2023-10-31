import axios, { BASE_URL } from "@/service/service";

export const templateList = async (data: unknown) => {
  return await axios.get(BASE_URL + "/templates/list");
};
