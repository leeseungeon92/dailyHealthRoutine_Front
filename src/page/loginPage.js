// src/pages/LoginPage.jsx
import React, { useState } from "react";
import api from "../api/axios";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";

function LoginPage() {
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

      // 공통 응답: { code, message, status, data: { token } }
      if (res.data.code === "SUCCESS") {
        const jwt = res.data.data.token;
        const username = res.data.data.username;
        setToken(jwt);
        setMessage("로그인 성공!");

        navigate("/");

        localStorage.setItem("accessToken", jwt);
        localStorage.setItem("username", username);
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
    <form onSubmit={handleLogin}>
      <Input 
        label={"아이디"}
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        placeHolder={"아이디를 입력하세요."}
      />
      <Input 
        label={"비밀번호"}
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeHolder={"비밀번호를 입력하세요."}
      />

      <button onClick={handleLogin} type="submit">로그인</button>

      {message && (
        <p style={{ marginTop: "8px", color: "blue" }}>{message}</p>
      )}

      {token && (
        <div style={{ marginTop: "8px", fontSize: "12px" }}>
          <div>발급된 토큰:</div>
          <code
            style={{
              display: "block",
              marginTop: "4px",
              padding: "4px",
              border: "1px solid #ccc",
              maxWidth: "100%",
              wordBreak: "break-all",
            }}
          >
            {token}
          </code>
        </div>
      )}
      </form>
  );
}

export default LoginPage;
