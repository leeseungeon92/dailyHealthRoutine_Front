import React from "react";
import LoginPage from "./page/loginPage"
import SignUpPage from "./page/signUpPage"

function App() {
  return (
    <div>
      <h1>Daily Exercise Routine</h1>
      <h2>회원가입</h2>
      <SignUpPage />
        
        <hr/>

      <h2>로그인</h2>
      <LoginPage />
    </div>
  )
}

export default App;
