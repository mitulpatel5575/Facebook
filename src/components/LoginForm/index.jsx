import * as  React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { setCredentials } from "../../app/features/user/userSlice";
import { AuthInput, Card, CustomButton, FormLoader } from "..";
import "./index.css";
import logo2 from "../../assets/svg/logo2.svg";
import SingninSvg from "../../assets/svg/Signin.svg";
import { loginValidation } from "../../utils/YupValidation";
import { useLoginMutation } from "../../app/features/auth/authApi";

const LoginForm = ({ setShowRegister }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = { email: "", password: "" };
  const { email, password } = form;
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  React.useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [navigate, dispatch, isSuccess]);

  // eye show hide handler
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const Eye = () => {
    setPasswordVisible(!passwordVisible);
  };
const GuestHandler = async()=>{
  const userData  = await login({
    email: "amrishy2003@gmail.com",
    password: "Asdf@1234",
  }).unwrap();
  dispatch(setCredentials({ ...userData }));
}
  return (
    <div className="login-container">
      <div className="login-head">
        <img src={logo2} alt="" className="login-image" />
        <span className="login-span">
          SocialConnect helps you connect and share with the people in your life.
        </span>
      </div>
      <Card className="login-card">
        <div className="SingninTitle">
          <h1 className="title">Sing In</h1>
          <img src={SingninSvg} alt="SingninSvg" className="SingninSvg" />
        </div>
        <Formik
          enableReinitialize={false}
          validationSchema={loginValidation}
          initialValues={{
            email,
            password,
          }}
          onSubmit={async (values, { setFieldError }) => {
            try {
              const userData = await login(values).unwrap();
              dispatch(setCredentials({ ...userData }));
            } catch (error) {
              setFieldError("email", error?.data?.email);
              setFieldError("password", error?.data?.password);
            }
          }}
        >
          {(formik) => {
            return (
              <Form className="login-form">
                <FormLoader loading={isLoading}>
                  <AuthInput
                    type="text"
                    name="email"
                    placeholder="Email address"
                  />

                  <AuthInput
                    name="password"
                    placeholder="password"
                    type={passwordVisible ? "text" : "password"}
                    onClick={Eye}
                  />
                </FormLoader>
                <CustomButton className="button" type="submit" value="Login" />
                <CustomButton className="gray_btn"  value="Login With Guest Account" disabled={isLoading}
                  onClick={GuestHandler} />
              </Form>
            );
          }}
        </Formik>

        <div className="login" onClick={() => setShowRegister(true)}>
          <span className="login_link">Not a member? Register</span>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
