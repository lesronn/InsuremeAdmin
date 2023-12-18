import React, { useState } from "react";
import "../../styles/login.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdPerson, MdLock } from "react-icons/md";
import colors from "../../config/colors";
import logo from "../../assets/welcome.png";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";

const Login = () => {
  const navigate = useNavigate();
  const { login } = AuthData();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required").label("Username"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setTimeout(async () => {
        await login(values.username, values.password)
          .then(() => {
            navigate("/");
            setLoading(false);
            console.log("sucess");
          })
          .catch(() => {
            setLoading(false);
            formik.errors.password = "Invalid Password";
          });
      }, 1000);
    },
  });

  return (
    <div className="loginApp">
      <div className="formSide container">
        <form onSubmit={formik.handleSubmit} method="post" className="form">
          <p className="loginheader" style={{ paddingBottom: 20 }}>
            INSURE
            <span style={{ color: colors.primaryBtn, fontFamily: "SoraBold" }}>
              M
            </span>
            E ADMIN PANEL
          </p>
          <div className="inputGroup">
            <label className="label">
              <MdPerson size={20} style={{ color: "black", paddingRight: 5 }} />
              Username
            </label>
            <input
              type="username"
              name="username"
              {...formik.getFieldProps("username")}
              placeholder="Enter Username"
              className={`${
                formik.touched.username && formik.errors.username
                  ? "error-input"
                  : ""
              }`}
            />
          </div>
          <div className="error-container first">
            {formik.touched.username && formik.errors.username && (
              <p className="error">{formik.errors.username}</p>
            )}
          </div>
          <div className="inputGroup">
            <label className="label">
              <MdLock size={20} style={{ color: "black", paddingRight: 5 }} />
              Password
            </label>
            <input
              name="password"
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="Your password"
              className={`${
                formik.touched.password && formik.errors.password
                  ? "error-input"
                  : ""
              }`}
            />
          </div>
          <div className="error-container">
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>

          <input
            type="submit"
            value={loading ? "Loading...." : "Log In"}
            className="button"
            style={{ backgroundColor: colors.primaryBtn }}
          />
          {/* {errorMessage ? (
            <div style={{ color: colors.danger, paddingT }}>{errorMessage}</div>
          ) : null} */}
        </form>
      </div>

      <div
        className="imageSide"
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {/* <img src={logo} alt="log" style={{ height: 200, width: 200 }} /> */}
      </div>
    </div>
  );
};

export default Login;
