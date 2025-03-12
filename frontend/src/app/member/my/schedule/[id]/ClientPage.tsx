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
  data: TripSchedule[];
}

export default function ClientPage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<TripSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // accessToken 가져오기
    const token = localStorage.getItem("accessToken");

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
        setSchedule(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) return <p className="p-6 text-xl">로딩 중...</p>;
  if (error) return <p className="p-6 text-xl text-red-600">{error}</p>;
  if (schedule.length === 0)
    return <p className="p-6 text-xl">일정 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="p-6">
      {schedule.map((sch) => (
        <div
          key={sch.id}
          className="mb-8 border border-gray-300 rounded-lg p-6 shadow"
        >
          <h1 className="text-3xl font-bold mb-2">{sch.title}</h1>
          <p className="text-lg mb-1">
            <strong>작성자:</strong> {sch.memberName}
          </p>
          <p className="text-lg mb-1">
            <strong>도시:</strong> {sch.cityName}
          </p>
          <p className="text-lg mb-1">
            <strong>설명:</strong> {sch.description}
          </p>
          <p className="text-md mb-3">
            <strong>여행 기간:</strong> {sch.startDate} ~ {sch.endDate}
          </p>

          <h2 className="text-2xl font-semibold mb-4">세부 일정</h2>
          <ul>
            {sch.tripInformations && sch.tripInformations.length > 0 ? (
              sch.tripInformations.map((info) => (
                <li
                  key={info.placeId}
                  className="mb-4 p-4 bg-white rounded shadow"
                >
                  <p className="text-xl font-bold">
                    {info.placeName} ({info.cityName})
                  </p>
                  <p className="text-md">
                    <strong>방문 시간:</strong>{" "}
                    {new Date(info.visitTime).toLocaleString()}
                  </p>
                  <p className="text-md">
                    <strong>소요 시간:</strong> {info.duration}시간
                  </p>
                  <p className="text-md">
                    <strong>이동 수단:</strong> {info.transportation}
                  </p>
                  <p className="text-md">
                    <strong>비용:</strong> {info.cost}원
                  </p>
                  <p className="text-md">
                    <strong>메모:</strong> {info.notes}
                  </p>
                  <p
                    className={`text-md font-bold ${
                      info.visited ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {info.visited ? "✅ 방문 완료" : "❌ 방문 예정"}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-md text-gray-600">
                세부 일정 정보가 없습니다.
              </p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
