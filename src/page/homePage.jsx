import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ExerciseCalendar from "./calenderPage";
import "../css/Homepage.css";

function HomePage({ token }) {
  const [routine, setRoutine] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [calendarReloadKey, setCalendarReloadKey] = useState(0);

  const showRoutine = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get("/api/exercise/getRoutine");
      console.log(res.data);
      setRoutine(res.data);
      setCompleted(res.data.completed);
    } catch (err) {
      console.log(err);
    }
  };

  const completeExercise = async () => {
    try {
      await api.post("/api/exercise/complete");
      setCompleted(true);
      setCalendarReloadKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) {
      setRoutine(null);
      setCompleted(false);
    }
  }, [token]);

  return (
    <div className="home-container">
      <div className="home-inner">
        <h1 className="home-title">DAILY HEALTH ROUTINE</h1>

        {!token && (
          <p className="home-sub">
            로그인 후 오늘의 운동 루틴을 확인해보세요.
          </p>
        )}

        {token && !routine && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button className="primary-btn" onClick={showRoutine}>
              오늘의 운동 루틴
            </button>
          </div>
        )}

        {token && routine && (
          <div>
            {/* 캘린더는 그대로, 나중에 따로 css 입히면 됨 */}
            <ExerciseCalendar reloadKey={calendarReloadKey} />

            {/* 오늘 루틴 카드 */}
            <div className="routine-card">
              <div className="routine-header">
                <div className="routine-date">오늘날짜 : {routine.date}</div>
                <div
                  className={
                    "routine-status " + (completed ? "completed" : "")
                  }
                >
                  {completed ? "오늘 운동 완료 ✅" : "오늘 아직 운동 전"}
                </div>
              </div>

              <ul className="exercise-list">
                {routine.exercises.map((ex, idx) => (
                  <li className="exercise-item" key={idx}>
                    <div className="exercise-name">{`< ${ex.name} >`}</div>
                    <img
                      src={ex.image}
                      className="exercise-img"
                      alt={ex.name}
                    />
                    <p className="exercise-meta">부위 : {ex.part}</p>
                    <p className="exercise-meta">세트 : {ex.sets}</p>
                    <p className="exercise-meta">반복 : {ex.raps}</p>
                    <p className="exercise-memo">★ 포인트 : {ex.memo}</p>
                  </li>
                ))}
              </ul>

              <div className="complete-section">
                {completed && (
                  <span className="complete-msg">
                    이미 오늘 운동을 완료했습니다.
                  </span>
                )}
                <button
                  className="primary-btn"
                  onClick={completeExercise}
                  disabled={completed}
                >
                  {completed ? "완료됨" : "오늘 운동 완료!"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
