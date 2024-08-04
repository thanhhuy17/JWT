// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import axios from "axios";
import { createAxios } from "../../createInstance";
import { logoutSuccess } from "../../redux/authSlice";
const NavBar = () => {
  // const [user, setUSer] = useState("hahaha");
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  // let axiosJWT = axios.create();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logoutSuccess);
  console.log("huy: ", user);

  const handleLogout = () => {
    logoutUser(navigate, user?._id, axiosJWT, dispatch, user?.accessToken);
  };
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home">
        Home
      </Link>
      {user ? (
        <>
          <p className="navbar-user">
            Hi, <span> {user.username} </span>
          </p>
          <Link to="/logout" className="navbar-logout" onClick={handleLogout}>
            Log out
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login">
            Login
          </Link>
          <Link to="/register" className="navbar-register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
