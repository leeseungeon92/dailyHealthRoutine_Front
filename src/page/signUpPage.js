import React, { useState } from "react";
import api from "../api/axios";
import Input from "../components/input";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("api/auth/signup", {
        username: username,
        password: password,
      });

      // 백엔드 공통 응답 구조: code/message/status/data
      if (res.data.code === "SUCCESS") {
        setMessage("회원가입 성공!");
      } else {
        setMessage(res.data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setMessage(err.response.data.message || "회원가입 실패");
      } else {
        setMessage("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <Input
        label={"아이디"}
        value={username}
        onChange={(e)=> setUsername(e.target.value)}
        placeHolder={"아이디를 입력해주세요."}
      />

      <Input
        label={"비밀번호"}
        type="password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        placeHolder={"비밀번호를 입력해주세요."}
      />

      <button type="submit">회원가입</button>

      {message && (
        <p style={{ marginTop: "8px", color: "blue" }}>{message}</p>
      )}
      </form>
  );
}

export default SignupPage;
