import axios from "axios";
import authAxios from "@/service/service";
import { BASE_URL } from "./service";

export const signInWithToken = async () => {
  return await authAxios.post(BASE_URL + "/auth/signinWithToken");
};


export const signIn = async (email: string, password: string) => {
  return await axios.post(BASE_URL + "/auth/signin", {
    email,
    password,
  });
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
