import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RefreshContext } from "../../context/RefreshContext";
import './Login.css'

export default function Login() {
  const { refresh, setRefresh } = useContext(RefreshContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // login
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const loginInput = {
      email: email,
      password: password,
    };
    try {
      const { data } = await axios.post("/api/user/login", loginInput);
      if (data) {
        setRefresh((prev) => !prev);
        navigate("/profile");
      }
    } catch (e) {
      console.log(e);
      setError("An Error occured, try again later");
    }
  };

  return (
    <>
    <div className="login-page">
      <div className="headline">
        <h1>
          Login to your Account
        </h1>
      </div>

    <form onSubmit={submit}>
      <input name="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} id="email"/>
      <input name="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} id="password"/>
      <button type="submit" className="sign-btn">Login</button>
      {error && <small style={{ color: "red" }}>{error}</small>}
    </form>

    <div className="sign-in-user">
        <p className="login-signup-question">Don't have an account?</p>
        <Link to="/signup" className="sign-in">
          Sign up
        </Link>
      </div>
    </div>
    </>
  );
}
