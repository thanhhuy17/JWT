import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import axios from "axios";
import {
  deleteUserFalse,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFalse,
  getUsersStart,
  getUsersSuccess,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/v1/auth/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("/v1/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};
// continues
//1. Get All User
//2. Delete User
//3. Log out

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get("/v1/user", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFalse());
  }
};

export const deleteUser = async (
  accessToken,
  dispatch,
  userId,
  navigate,
  axiosJWT
) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete("/v1/user/" + userId, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(deleteUserSuccess(res.data));
    // navigate("/register")
  } catch (err) {
    dispatch(deleteUserFalse(err.response.data));
  }
};

//LOGOUT
export const logoutUser = async (
  navigate,
  id,
  axiosJWT,
  dispatch,
  accessToken
) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post("v1/auth/logout", id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logoutFailed(err.response.data));
  }
};
