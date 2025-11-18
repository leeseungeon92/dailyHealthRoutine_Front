import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar(){
    const navigate = useNavigate();

    const [me, setMe] = useState(null);
    const token = localStorage.getItem("accessToken");

    useEffect(()=>{
        if(!token) return;

        const fetchMe = async()=>{
            try {
                const res = await api.get("/api/user/myinfo");
                if(res.data.code == "SUCCESS"){
                    setMe(res.data.data);
                }
            } catch(err){
                console.log(err);
                if(err.response && err.response.status === 401){
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("username");
                }
            }
        }
        fetchMe();
    }, [token]);

    const handleLogOut = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        setMe(null);
        navigate("/");
    }

    return(
        <div>
            {token && me ? (
                <div>
                    <p>
                        <b>
                            {me.username}님 환영합니다.
                            {me.role && ` (${me.role})`}
                        </b>
                    </p>
                    <button onClick={handleLogOut}>logOut</button>
                </div>
            ) : 
            <div>
                <button onClick={()=>navigate("/login")}>Login</button>
                <button onClick={()=>navigate("/signUp")}>SignUp</button>
            </div>
            }
        </div>
    )
}

export default Navbar;
