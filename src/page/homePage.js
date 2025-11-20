import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";
import api from "../api/axios";

function HomePage({token}) {

    const [routine, setRoutine] = useState(null);
    const showRoutine = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get("/api/exercise/getRoutine");
            console.log(res.data);
            setRoutine(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        if(!token){
            setRoutine(null);
        }
    }, [token]);

    return (
        <div>
            <h1>DAILY HEALTH ROUTINE</h1>
            {token ? <button onClick={showRoutine}>오늘의 운동 루틴</button> : <p>로그인 후 오늘의 운동 루틴을 확인해보세요.</p>}

            {token && routine && (
                <div>
                    <h2>오늘날짜 : {routine.date}</h2>
                    <h3>{routine.exercises.map((ex, idx) => {
                        return (
                            <li key={idx}>
                                <h3>{`< ${ex.name} >`}</h3>
                                <img src={ex.image} style={{width:"200px", borderRadius:"12px"}}/>
                                <p>부위 : {ex.part}</p>
                                <p>세트 : {ex.sets}</p>
                                <p>반복 : {ex.raps}</p>
                                <p>★ 포인트 : {ex.memo}</p>
                            </li>
                        )
                    })}</h3>
                </div>
            )}
        </div>
    )
}

export default HomePage;