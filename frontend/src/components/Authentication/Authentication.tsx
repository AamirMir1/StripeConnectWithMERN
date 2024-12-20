import { FormEvent, useState } from "react";
import "./Authentication.css";

import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { setUser } from "../../redux/reducers/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(false);

  // Signup States

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res: AxiosResponse = await axios.post(
        `/user/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Account Created Successfully");
      setName("");
      setEmail("");
      setPassword("");

      dispatch(setUser(res.data.user));

      navigate("/");
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res: AxiosResponse = await axios.post(
        `/user/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Logged In Successfully");
      setName("");
      setEmail("");
      setPassword("");

      dispatch(setUser(res.data.user));

      navigate("/");
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="main-auth-container">
      <div className="form-container">
        <div className="auth-buttons-container">
          <button
            style={{
              backgroundColor: isLogin ? "tomato" : "lightgray",
              color: isLogin ? "white" : "black",
            }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={{
              backgroundColor: !isLogin ? "tomato" : "lightgray",
              color: !isLogin ? "white" : "black",
            }}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <input type="submit" value={"Login"} />
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name"
              type="text"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <input type="submit" value={"Signup"} />
          </form>
        )}
      </div>
    </div>
  );
};

export default Authentication;
