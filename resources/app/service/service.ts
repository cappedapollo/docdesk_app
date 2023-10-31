import axios from "axios";

export const BASE_URL = "/api/v1";

const instance = axios.create();

instance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("userToken");

export default instance;
