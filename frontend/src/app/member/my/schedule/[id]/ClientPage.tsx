"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TripInformation {
  tripInformationId: number; // 고유 식별자
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
  const router = useRouter();
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
            credentials: "include",
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
        if (!result.data) {
          throw new Error("해당 ID의 여행 일정이 존재하지 않습니다.");
        }
        setSchedule(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  // 방문 여부 업데이트 함수 (백엔드 /trip/information/update-visited 호출)
  const updateVisitedStatus = async (
    tripInformationId: number,
    newStatus: boolean
  ) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        `http://localhost:8080/trip/information/update-visited`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tripInformationId,
            isVisited: newStatus,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("방문 여부 업데이트에 실패했습니다.");
      }
      // 업데이트 성공하면 로컬 상태 갱신
      setSchedule((prevSchedules) =>
        prevSchedules.map((sch) => ({
          ...sch,
          tripInformations: sch.tripInformations?.map((info) =>
            info.tripInformationId === tripInformationId
              ? { ...info, visited: newStatus }
              : info
          ),
        }))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  // 세부 일정 삭제 함수 (DELETE /trip/information/{tripInformationId})
  const handleDeleteTripInfo = async (tripInformationId: number) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        `http://localhost:8080/trip/information/${tripInformationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("세부 일정 삭제 실패");
      alert("세부 일정 삭제 성공");
      // 상태 업데이트: 삭제된 항목 제거
      setSchedule((prev) =>
        prev.map((sch) => ({
          ...sch,
          tripInformations: sch.tripInformations?.filter(
            (info) => info.tripInformationId !== tripInformationId
          ),
        }))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  if (loading) return <p className="p-6 text-xl text-center">로딩 중...</p>;
  if (error)
    return <p className="p-6 text-xl text-center text-red-600">{error}</p>;
  if (schedule.length === 0)
    return (
      <p className="p-6 text-xl text-center">일정 정보를 찾을 수 없습니다.</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          onClick={() => router.push("/member/my")}
        >
          ← 뒤로 가기
        </button>
      </div>

      {schedule.map((sch) => (
        <div
          key={sch.id}
          className="mb-8 bg-white rounded-lg overflow-hidden shadow-lg"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
            <h1 className="text-3xl font-bold text-white">{sch.title}</h1>
          </div>
          <div className="p-6">
            <p className="text-lg text-gray-800 mb-1">
              <span className="font-semibold">도시:</span> {sch.cityName}
            </p>
            <p className="text-lg text-gray-800 mb-1">
              <span className="font-semibold">설명:</span> {sch.description}
            </p>
            <p className="text-md text-gray-600 mb-3">
              <span className="font-semibold">여행 기간:</span> {sch.startDate}{" "}
              ~ {sch.endDate}
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              세부 일정
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sch.tripInformations && sch.tripInformations.length > 0 ? (
                sch.tripInformations.map((info) => (
                  <div
                    key={info.tripInformationId}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {info.placeName}{" "}
                      <span className="text-sm text-gray-500">
                        ({info.cityName})
                      </span>
                    </h3>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">방문 시간:</span>{" "}
                      {new Date(info.visitTime).toLocaleString()}
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">소요 시간:</span>{" "}
                      {info.duration}시간
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">이동 수단:</span>{" "}
                      {info.transportation}
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">비용:</span> {info.cost}원
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">메모:</span> {info.notes}
                    </p>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={info.visited}
                        onChange={(e) =>
                          updateVisitedStatus(
                            info.tripInformationId,
                            e.target.checked
                          )
                        }
                      />
                      {info.visited ? "✅ 방문 완료" : "❌ 방문 예정"}
                    </label>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/member/my/schedule/update/${info.tripInformationId}`
                          )
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteTripInfo(info.tripInformationId)
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-md text-gray-500">
                  세부 일정 정보가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
