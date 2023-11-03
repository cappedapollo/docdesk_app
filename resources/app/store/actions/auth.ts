import { signIn, signUp, signInWithToken } from "@/service/auth";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setResponse } from "@/store/reducers/auth";

export const SignInWithTokenAction = () => {
  return async (dispatch) => {
    try {
      const {
        data: { success, message, token, user },
      } = await signInWithToken();
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
  };
};

export const SignInAction = (username: string, password: string) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token, user },
      } = await signIn(username, password);
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};


export const SignOutAction = () => {
  return async (dispatch) => {
    localStorage.removeItem("userToken");
    dispatch(setResponse({success: false}));
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
        data: { message },
      } = await signUp(name, email, password, password_confirmation);

      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};
