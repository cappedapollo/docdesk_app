import axios from "axios";
import { BASE_URL } from "./service";

export const signIn = async (email: string, password: string) => {
  return await axios.post(BASE_URL + "/auth/signin", {
    email,
    password,
  });

  /*.then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });*/
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  return await axios.post(BASE_URL + "/auth/signup", {
    name,
    email,
    password,
    password_confirmation,
  });
};
