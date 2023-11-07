import "./SignUp.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RefreshContext } from "../../context/RefreshContext";

export default function SignUp() {
  const { refresh, setRefresh } = useContext(RefreshContext);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  let waitForNavigation;

  // signup
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const signupInput = {
      email: email,
      password: password,
    };
    try {
      await axios.post("/api/user/signup", signupInput);
      setSuccess(true)
    } catch (e) {
      if (e?.response?.data?.error?.message) {
        setError(e?.response?.data?.error?.message);
      } else {
        setError("An Error occured, try again later");
      }
    }
  };

  const goToProfile = () => {
    nav("/profile");
    clearTimeout(waitForNavigation)
  }

  // logging in automatically after signup was successful
  useEffect(() => {
    const loggingIn = async () => {
      if (success === true){
        const loginInput = {
          email: email,
          password: password,
        };
        try {
          const { data } = await axios.post("/api/user/login", loginInput);
          if (data) {
            setRefresh((prev) => !prev);
            waitForNavigation = setTimeout(goToProfile, 3000);
          }
        } catch (e) {
          console.log(e);
          setError("An Error occured, try again later");
        }
      } else {
        return
      }
    }
    loggingIn()
  },[success])

  return (
    <>
      <div className="sign-up-page">
        <div className="headline">
        <h1>
          Create your Account
        </h1>
        </div>

    <form onSubmit={submit}>
      <input name="email" type="text" placeholder="Email" id="email" onChange={(e) => setEmail(e.target.value)}/>
      <div className="password-hide">
      <input name="password" type="password" placeholder="Password" id="password" onChange={(e) => setPassword(e.target.value)}/>
      </div>
      {error && <small style={{ color: "red" }}>{error}</small>}
      <button type="submit" className="sign-btn">Sign up</button>
    </form>
    {success && <p className="sign-up-info-text">Sign up was successful. Logging in and forwarding to your Profile..</p>}
    
      <div className="sign-in-user">
        <p>Already have an account?</p>
        <Link to="/login" className="sign-in">
          Sign in
        </Link>
      </div>
    </div>
  </>
  );
}