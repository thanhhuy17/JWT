import { useEffect } from "react";
import "./home.css";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.login?.currentUser);
  const usersList = useSelector((state) => state?.users?.users?.allUsers);
  const message = useSelector((state) => state?.users?.msg);
  // let axiosJWT = axios.create();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  console.log("test user: ", message);
  //DUMMY DATA
  // const userData = [
  //   {
  //     username: "anhduy120212",
  //   },
  //   {
  //     username: "kelly1234",
  //   },
  //   {
  //     username: "danny5678",
  //   },
  //   {
  //     username: "kenny1122",
  //   },
  //   {
  //     username: "jack1234",
  //   },
  //   {
  //     username: "loi1202",
  //   },
  //   {
  //     username: "nhinhi2009",
  //   },
  //   {
  //     username: "kellynguyen1122",
  //   },
  // ];

  const handleDelete = (id) => {
    // console.log(id);
    deleteUser(user?.accessToken, dispatch, id, navigate, axiosJWT);
  };

  // Refresh Token

  // const refreshToken = async () => {
  //   try {
  //     const res = await axios.post("/v1/auth/refresh", {
  //       withCredentials: true,
  //     });
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     let date = new Date();
  //     const decodedToken = jwtDecode(user?.accessToken);
  //     if (decodedToken.exp < date.getTime() / 1000) {
  //       const data = await refreshToken();
  //       const refreshUser = {
  //         ...user,
  //         accessToken: data.accessToken,
  //       };
  //       dispatch(loginSuccess(refreshUser));
  //       config.headers["token"] = "Bearer" + data.accessToken;
  //     }
  //     return config;
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   }
  // );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div>{`Your Route: ${user?.admin ? "Admin" : "User"}`}</div>
      <div className="home-userlist">
        {usersList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => handleDelete(user?._id)}
              >
                Delete
              </div>
            </div>
          );
        })}
      </div>
      <div>{message}</div>
    </main>
  );
};

export default HomePage;
