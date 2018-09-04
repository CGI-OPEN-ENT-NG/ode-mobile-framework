import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { Conf } from "../../Conf";
import { navigate } from "../../utils/navHelper";

export function login(credentials?: {
  username: string;
  password: string;
}): ThunkAction<void, any, null, AnyAction> {
  return async (dispatch, getState) => {
    try {
      // tslint:disable-next-line:no-console
      console.log("start login");
      const token = credentials
        ? await getToken(credentials)
        : await loadToken();
      // tslint:disable-next-line:no-console
      console.log(token);
      dispatch({ type: "LOGGED" });
    } catch (errmsg) {
      // dispatch(homeworkDiaryListFetchError(errmsg));
      // tslint:disable-next-line:no-console
      console.warn("login failed.");
      navigate("Login", { email: "" });
    }
  };
}

/**
 * Force get a fresh new token with given credentials.
 * @param credentials
 */
export async function getToken(credentials: {
  username: string;
  password: string;
}) {
  try {
    // tslint:disable-next-line:no-console
    console.log("get new token");
    throw new Error("not implemented");
  } catch (errmsg) {
    // dispatch(homeworkDiaryListFetchError(errmsg));
    // tslint:disable-next-line:no-console
    console.warn("get tokens failed.");
    throw errmsg;
  }
}

/**
 * Read stored token in local storage.
 */
export async function loadToken() {
  try {
    // tslint:disable-next-line:no-console
    console.log("get new token");
    throw new Error("not implemented");
  } catch (errmsg) {
    // dispatch(homeworkDiaryListFetchError(errmsg));
    // tslint:disable-next-line:no-console
    console.warn("get tokens failed.");
    throw errmsg;
  }
}
