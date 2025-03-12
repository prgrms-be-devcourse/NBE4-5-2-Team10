"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TripInformation {
  placeId: number;
  visitTime: string;
  duration: number;
  transportation: string;
  cost: number;
  notes: string;
  priority: number;
  visited: boolean;
}

interface TripSchedule {
  title: string;
  description: string;
  cityName: string;
  startDate: string;
  endDate: string;
  tripInformations: TripInformation[];
}

export default function ClientPage() {
  const router = useRouter();

  // 여행 일정 기본 필드
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cityName, setCityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 세부 일정 배열 (동적 추가)
  const [tripInformations, setTripInformations] = useState<TripInformation[]>(
    []
  );

  // 임의의 교통수단 옵션 (필요에 따라 확장 가능)
  const transportationOptions = ["WALK", "BUS", "SUBWAY", "CAR", "TAXI", "ETC"];

  // 세부 일정 추가 핸들러
  const addTripInformation = () => {
    setTripInformations([
      ...tripInformations,
      {
        placeId: 0,
        visitTime: "",
        duration: 0,
        transportation: "",
        cost: 0,
        notes: "",
        priority: 0,
        visited: false,
      },
    ]);
  };

  // 세부 일정 변경 핸들러
  const updateTripInformation = (
    index: number,
    field: keyof TripInformation,
    value: string | number | boolean
  ) => {
    const updated = [...tripInformations];
    updated[index] = { ...updated[index], [field]: value };
    setTripInformations(updated);
  };

  // 세부 일정 제거 핸들러
  const removeTripInformation = (index: number) => {
    setTripInformations(tripInformations.filter((_, idx) => idx !== index));
  };

  // 등록 API 호출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 등록할 여행 일정 객체 생성
    const schedule: TripSchedule = {
      title,
      description,
      cityName,
      startDate,
      endDate,
      tripInformations,
    };

    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await fetch("http://localhost:8080/trip/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schedule),
      });

      if (!response.ok) {
        throw new Error("등록에 실패했습니다.");
      }
      // 등록 성공 후, 목록 페이지나 상세 페이지로 이동
      router.push("/member/my");
    } catch (error: any) {
      alert(error.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">여행 일정 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 기본 일정 정보 */}
        <div>
          <label className="block mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1">도시</label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">종료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* 세부 일정 */}
        <div className="border p-4 rounded">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">세부 일정</h2>
            <button
              type="button"
              onClick={addTripInformation}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              추가
            </button>
          </div>

          {tripInformations.length === 0 ? (
            <p className="text-gray-600">세부 일정이 없습니다.</p>
          ) : (
            tripInformations.map((info, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTripInformation(index)}
                    className="text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">장소 ID</label>
                    <input
                      type="number"
                      value={info.placeId || ""}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "placeId",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">방문 시간</label>
                    <input
                      type="datetime-local"
                      value={info.visitTime}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "visitTime",
                          e.target.value
                        )
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">소요 시간 (분)</label>
                    <input
                      type="number"
                      value={info.duration || ""}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "duration",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">교통수단</label>
                    <select
                      value={info.transportation}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "transportation",
                          e.target.value
                        )
                      }
                      className="w-full border rounded p-2"
                    >
                      <option value="">선택하세요</option>
                      {transportationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">비용</label>
                    <input
                      type="number"
                      value={info.cost || ""}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "cost",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">메모</label>
                    <textarea
                      value={info.notes}
                      onChange={(e) =>
                        updateTripInformation(index, "notes", e.target.value)
                      }
                      className="w-full border rounded p-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">우선순위</label>
                    <input
                      type="number"
                      value={info.priority || ""}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "priority",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={info.visited}
                      onChange={(e) =>
                        updateTripInformation(
                          index,
                          "visited",
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <span>방문 여부</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded text-xl"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
