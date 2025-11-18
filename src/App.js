import React from "react";
import LoginPage from "./page/loginPage"
import SignUpPage from "./page/signUpPage"
import HomePage from "./page/homePage"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navBar";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
