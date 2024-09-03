import React, {  useState } from "react";
import "./loginPage.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";


import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

import {toast, ToastContainer} from 'react-toastify'

const LoginPage = () => {
  const navigate = useNavigate();

  const [inputType, setInputType] = useState(true)
  const [loginState, setLoginState] = useState({
    login: true,
    signup: false,
  });

  const onHandleState = () => {
    if (loginState.login) {
      setLoginState({ ...loginState, login: false, signup: true });
    } else {
      setLoginState({ ...loginState, login: true, signup: false });
    }
  };

  const handleInputType = () => {
    setInputType(!inputType);
 }


/* login */
 const handleLogin = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const { email, password } = Object.fromEntries(formData);

    try {
      if (email.length === 0) {
        toast.error("enter your email address");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password)
      const res = onAuthStateChanged(auth, (user) => {
        if (user.uid) {
          if (toast.isActive(null)) { // Проверьте, активен ли какой-либо toast
              toast.dismiss();
          }
         
          setTimeout(() => {
            navigate("/", { state: user.uid });
          }, 500);
        } else {
          return;
        }
         
      });

    } catch (error) {
        console.error(error)
        toast.error("There is no such account!");
    }
 }



 // registration
 const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { username, email, password } = Object.fromEntries(formData);

    try {
        if (username.length === 0) {
          toast.error("Enter your username");
          return;
        }
        if (email.length === 0) {
          toast.error("Enter your email address");
          return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        const res = await createUserWithEmailAndPassword(auth,email, password);    
        
        await setDoc(doc(db, "users", res.user.uid), {
          username: username,
          email: email,
          id: res.user.uid,
          blocked: [],
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
          chats: []
        });
        
        toast.success("Account registered! You can log in now")
        setLoginState({ ...loginState, login: true, signup: false });
    } catch (error) {
        console.error(error);
        toast.error("Perhaps such an account already exists!");
    }
 }


  return (
    <div>
      <div className="wrapper">
        <div className="main_login-block">
          <div className="main_login-inner">
            <div className="buttons_block">
              <Button onClick={onHandleState}>
                {loginState.login ? "Sign up" : "Log in"}
              </Button>
            </div>
            {loginState.login && (
              <form id="loginform" onSubmit={handleLogin} className="form">
                <Input
                  placeholder={"Email"}
                  type="email"
                  className="login_input"
                  name="email"
                />
                <div className="passwordInput_block">
                  <Input
                    placeholder={"Password"}
                    type={inputType ? "password" : "text"}
                    className="login_input passwordInput"
                    name="password"
                  />
                  <span
                    onClick={handleInputType}
                    className="handleInputTypeBtn"
                  >
                    {inputType ? "show" : "hide"}
                  </span>
                </div>
                <Button type="submit" form="loginform">
                  Login
                </Button>
              </form>
            )}
            {loginState.signup && (
              <form id="regform" onSubmit={handleRegister} className="form">
                <Input
                  placeholder={"Username"}
                  type="text"
                  className="login_input"
                  name="username"
                />
                <Input
                  placeholder={"Email"}
                  type="email"
                  className="login_input"
                  name="email"
                />
                <div className="passwordInput_block">
                  <Input
                    placeholder={"Password"}
                    type={inputType ? "password" : "text"}
                    className="login_input passwordInput"
                    name="password"
                  />
                  <span
                    onClick={handleInputType}
                    className="handleInputTypeBtn"
                  >
                    {inputType ? "show" : "hide"}
                  </span>
                </div>
                <Button form="regform">Sign up</Button>
              </form>
            )}
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
