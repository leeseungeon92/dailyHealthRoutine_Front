import React, { useState } from "react";
import api from "../api/axios";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import "../css/Loginpage.css";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setToken("");

    try {
      const res = await api.post("api/auth/login", {
        username: username,
        password: password,
      });

      if (res.data.code === "SUCCESS") {
        const accessToken = res.data.data.token;
        const username = res.data.data.username;
        setToken(accessToken);
        setMessage("로그인 성공!");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);

        onLogin(accessToken);
        navigate("/");
      } else {
        setMessage(res.data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setMessage(err.response.data.message || "로그인 실패");
      } else {
        setMessage("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h1 className="login-title">로그인</h1>

        <Input
          label={"아이디"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeHolder={"아이디를 입력하세요."}
        />

        <Input
          label={"비밀번호"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeHolder={"비밀번호를 입력하세요."}
        />

        <button className="login-button" type="submit">
          로그인
        </button>

        {message && <p className="login-message">{message}</p>}

        {token && (
          <div className="login-token-box">
            <div>발급된 토큰:</div>
            <div>{token}</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
