import { signIn, signUp } from "@/service/auth";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setResponse } from "@/store/reducers/auth";

export const SignInAction = (username: string, password: string) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token },
      } = await signIn(username, password);
      console.log(token)
      localStorage.setItem("userToken", token);
      localStorage.setItem("email", username);
      dispatch(setResponse({success, email: username}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const SignUpAction = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message },
      } = await signUp(name, email, password, password_confirmation);

      dispatch(setResponse({success, email}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};
