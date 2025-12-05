// src/hooks/useExerciseHistory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useExerciseHistory(year: number, month: number) {
  const queryClient = useQueryClient();

  // 1) 운동 히스토리 조회 (캘린더에서 사용)
  const historyQuery = useQuery({
    queryKey: ["exerciseHistory", year, month],
    queryFn: async () => {
      const res = await api.get("/api/exercise/history", {
        params: { year, month },
      });
      // 백엔드 응답이 { completedDays: number[], totalDayInMonth: number } 형태라고 가정
      return res.data;
    },
  });

  // 2) 오늘 운동 완료 (홈에서 사용)
  const completeTodayMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const day = now.getDate();

      await api.post("/api/exercise/complete-today", {
        year,
        month,
        day,
      });

      return day; // onSuccess에서 쓸 수 있게 반환
    },
    onSuccess: (today) => {
      // ✅ 이 월(year, month)의 히스토리를 다시 불러오도록 지시
      queryClient.invalidateQueries({
        queryKey: ["exerciseHistory", year, month],
      });

      // 원하면 여기서 낙관적 업데이트로 바로 초록색 만들 수도 있음
      // (지금은 invalidate만으로도 충분)
    },
  });

  // 사용하기 편하게 포장해서 반환
  const completedDaysSet = new Set<number>(
    historyQuery.data?.completedDays || []
  );
  const totalDays = historyQuery.data?.totalDayInMonth || 30;

  return {
    // 조회용 데이터
    completedDays: completedDaysSet,
    totalDays,
    isLoading: historyQuery.isLoading,

    // 완료 버튼용 함수/상태
    completeToday: completeTodayMutation.mutate,
    isCompleting: completeTodayMutation.isPending,
  };
}
