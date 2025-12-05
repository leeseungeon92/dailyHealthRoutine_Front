import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "../css/ExerciseCalendar.css";

function ExerciseCalendar({ reloadKey }) {
  const today = new Date();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const [completedDays, setCompleteDays] = useState(new Set());
  const [totalDays, setTotalDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/exercise/history", {
        params: { year, month },
      });

      const data = res.data;
      setCompleteDays(new Set(data.completedDays || []));
      setTotalDays(data.totalDayInMonth || 30);
    } catch (err) {
      console.log("운동 히스토리 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [year, month, reloadKey]);

  // 해당 월의 1일이 무슨 요일인지 (0:일 ~ 6:토)
  const getFirstDayOfWeek = (year, month) => {
    const date = new Date(year, month - 1, 1);
    return date.getDay();
  };

  // 간단하게 totalDays 사용 (백엔드에서 주면 그대로 쓰면 됨)
  const daysInMonth = totalDays;
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  // 달력용 day 배열 만들기 (앞쪽 빈 칸 포함)
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  // 완료율 계산
  const completedCount = completedDays.size;
  const completionRate =
    totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((prev) => prev - 1);
      setMonth(12);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((prev) => prev + 1);
      setMonth(1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  return (
    <div
      className="calendar-card"
      style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      {/* 상단 헤더: 월 이동 + 제목 */}
      <div
        className="calendar-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={handlePrevMonth}>◀</button>
        <h2 className="calendar-title">
          {year}년 {month}월
        </h2>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* 완료율 */}
      <div style={{ marginBottom: "12px" }}>
        {loading ? (
          <span>불러오는 중...</span>
        ) : (
          <span>
            운동 완료일: {completedCount} / {totalDays}일 ({completionRate}
            %)
          </span>
        )}
      </div>

      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginBottom: "4px",
          fontWeight: "bold",
        }}
      >
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

      {/* 날짜 셀 */}
      <div
        className="calendar-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          gap: "4px",
        }}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} />;
          }

          const isCompleted = completedDays.has(day);

          return (
            <div
              key={idx}
              className={`day-cell ${isCompleted ? "completed" : ""}`}
              style={{
                padding: "6px 0",
                borderRadius: "50%",
                margin: "0 auto",
                width: "36px",
                height: "36px",
                lineHeight: "36px",
                backgroundColor: isCompleted ? "#4caf50" : "#f0f0f0",
                color: isCompleted ? "#fff" : "#333",
                fontWeight: isCompleted ? "bold" : "normal",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div
        className="calendar-legend"
        style={{ marginTop: "10px", fontSize: "12px" }}
      >
        <span>
          <span
            className="legend-dot completed"
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: "#4caf50",
              marginRight: "4px",
            }}
          />
          운동 완료한 날
        </span>
      </div>
    </div>
  );
}

export default ExerciseCalendar;
