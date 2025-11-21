import React, { useState } from "react";
import LoginPage from "./page/loginPage"
import SignUpPage from "./page/signUpPage"
import HomePage from "./page/homePage"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navBar";

function App() {

  const[token, setToken] = useState(localStorage.getItem("accessToken"));
  
  const handleLogin = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setToken(null);
    window.location = "/";
  }

  return (
    <BrowserRouter>
      <Navbar token={token} onLogout={handleLogOut}/>
      <Routes>
        <Route path="/" element={<HomePage token={token}/>}/>
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>}/>
        <Route path="/signup" element={<SignUpPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
