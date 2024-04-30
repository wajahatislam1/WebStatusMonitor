// Auth.js
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/slices/user.slice";
import { useLocation } from "react-router-dom";
import { tokenValid } from "../../../api/users/users.api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const locationRef = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      if (token) {
        const isValid = await tokenValid(token);
        if (isValid) {
          dispatch(setToken(token));
          message.success("Authentication successful. Redirecting...");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          message.error("Authentication failed");
        }
      }
    };

    if (location.search !== locationRef.current.search) {
      fetchData();
      locationRef.current = location;
    }
  }, [dispatch, location]);

  return (
    <>
      <h1>Authenticating...</h1>
    </>
  );
};

export default GoogleAuth;
