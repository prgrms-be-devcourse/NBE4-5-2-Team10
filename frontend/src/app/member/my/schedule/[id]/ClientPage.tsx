"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TripInformation {
  placeId: number;
  cityName: string;
  placeName: string;
  visitTime: string;
  duration: number;
  transportation: string;
  cost: number;
  notes: string;
  priority: number;
  visited: boolean;
}

interface TripSchedule {
  id: number;
  memberName: string;
  title: string;
  cityName: string;
  description: string;
  startDate: string;
  endDate: string;
  tripInformations?: TripInformation[];
}

interface ApiResponse {
  code: string;
  msg: string;
  data: TripSchedule;
}

export default function ClientPage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<TripSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/trip/schedule/my-schedules/${id}`,
          {
            method: "GET",
            credentials: "include", // 쿠키 포함
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("일정 정보를 불러오는데 실패했습니다.");
        }

        const result: ApiResponse = await response.json();
        console.log("응답결과 : ", result);
        if (!result.data) {
          throw new Error("해당 ID의 여행 일정이 존재하지 않습니다.");
        }
        console.log("API 응답 데이터 내부 데이터:", result.data);
        console.log(
          "API 응답 데이터 내부 tripInformations:",
          result.data.tripInformations
        );
        console.log("전체 응답:", JSON.stringify(result, null, 2));

        setSchedule(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!schedule) return <p>일정 정보를 찾을 수 없습니다.</p>;
  console.log("스케줄 확인 : ", schedule);
  console.log("세부일정 확인 : ", schedule.tripInformations);

  return (
    <div>
      <h1>{schedule.title}</h1>
      <p>
        <strong>작성자:</strong> {schedule.memberName}
      </p>
      <p>
        <strong>도시:</strong> {schedule.cityName}
      </p>
      <p>
        <strong>설명:</strong> {schedule.description}
      </p>
      <p>
        <strong>여행 기간:</strong> {schedule.startDate} ~ {schedule.endDate}
      </p>

      <h2>세부 일정</h2>
      <ul>
        {schedule?.tripInformations?.map((info) => (
          <li key={info.placeId}>
            <p>
              <strong>장소:</strong> {info.placeName} ({info.cityName})
            </p>
            <p>
              <strong>방문 시간:</strong>{" "}
              {new Date(info.visitTime).toLocaleString()}
            </p>
            <p>
              <strong>소요 시간:</strong> {info.duration}시간
            </p>
            <p>
              <strong>이동 수단:</strong> {info.transportation}
            </p>
            <p>
              <strong>비용:</strong> {info.cost}원
            </p>
            <p>
              <strong>메모:</strong> {info.notes}
            </p>
            <p>
              <strong>우선순위:</strong> {info.priority}
            </p>
            <p>
              <strong>방문 여부:</strong>{" "}
              {info.visited ? "✅ 방문 완료" : "❌ 방문 예정"}
            </p>
            <hr />
          </li>
        )) || <p>일정 정보가 없습니다.</p>}
      </ul>
    </div>
  );
}
