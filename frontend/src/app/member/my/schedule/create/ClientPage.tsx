"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Place {
  placeId: number;
  cityName: string;
  placeName: string;
  // 필요하다면 category, description 필드도 추가
}

interface TripInformation {
  placeId: number;
  visitTime: string; // 예: '2025-07-02T10:00'
  duration: number; // 분 단위
  transportation: string; // 'WALK', 'BUS', 'SUBWAY', etc.
  cost: number;
  notes: string;
  priority: number;
  isVisited: boolean;
}

export default function ClientPage() {
  const router = useRouter();

  // 여행 일정 기본 필드
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 도시, 장소 선택 관련
  const [cities, setCities] = useState<string[]>([]); // 도시 목록
  const [cityName, setCityName] = useState<string>(""); // 선택한 도시
  const [placeList, setPlaceList] = useState<Place[]>([]);

  // 세부일정(TripInformation) 배열
  const [tripInformations, setTripInformations] = useState<TripInformation[]>(
    []
  );

  // 교통수단(enum)
  const transportationOptions = ["WALK", "BUS", "SUBWAY", "CAR", "TAXI", "ETC"];

  // 마운트 시 도시 목록 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/place/cities")
      .then((res) => res.json())
      .then((data) => {
        // data.data가 ["서울", "부산", "제주도", ...] 형태라고 가정
        setCities(data.data || []);
      })
      .catch((err) => console.error("도시 목록 조회 실패:", err));
  }, []);

  // 도시 선택 시 해당 도시의 place 목록 불러오기
  useEffect(() => {
    if (cityName) {
      fetch(
        `http://localhost:8080/place?cityName=${encodeURIComponent(cityName)}`
      )
        .then((res) => res.json())
        .then((data) => {
          // data.data가 [{ placeId, cityName, placeName }, ...] 형태
          setPlaceList(data.data || []);
          // 만약 기존에 선택한 placeId가 새 도시에 없으면 0으로 초기화
          setTripInformations((prev) =>
            prev.map((info) =>
              data.data.some((p: Place) => p.placeId === info.placeId)
                ? info
                : { ...info, placeId: 0 }
            )
          );
        })
        .catch((err) => console.error("도시별 place 목록 조회 실패:", err));
    } else {
      setPlaceList([]);
    }
  }, [cityName]);

  // 세부일정 추가
  const addTripInformation = () => {
    setTripInformations((prev) => [
      ...prev,
      {
        placeId: 0,
        visitTime: "",
        duration: 0,
        transportation: "",
        cost: 0,
        notes: "",
        priority: 0,
        isVisited: false,
      },
    ]);
  };

  // 세부일정 제거
  const removeTripInformation = (index: number) => {
    setTripInformations((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // 세부일정 변경
  const handleTripInformationChange = (
    index: number,
    field: keyof TripInformation,
    value: string | number | boolean
  ) => {
    setTripInformations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // 폼 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleRequest = {
      title,
      description,
      startDate,
      endDate,
      cityName, // 도시명
      tripInformations, // 세부일정(각 항목에 placeId, visitTime 등)
    };

    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await fetch("/trip/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleRequest),
      });

      if (!response.ok) {
        console.error("일정 등록 API 호출 실패");
        return;
      }
      const result = await response.json();
      console.log("일정 등록 성공:", result);
      router.push("/member/my");
    } catch (error) {
      console.error("일정 등록 중 에러 발생:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">여행 일정 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 여행 일정 정보 */}
        <div>
          <label className="block mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* 도시 Select Box */}
        <div>
          <label className="block mb-1">도시 선택</label>
          <select
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- 도시 선택 --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 세부 일정 목록 */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">여행 세부일정</h2>
          {tripInformations.map((info, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              {/* 장소 Select Box */}
              <div>
                <label className="block mb-1">장소 선택</label>
                <select
                  // value를 문자열로 유지
                  value={info.placeId === 0 ? "0" : String(info.placeId)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleTripInformationChange(
                      index,
                      "placeId",
                      isNaN(val) ? 0 : val
                    );
                  }}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option key="default" value="0">
                    -- 장소 선택 --
                  </option>
                  {placeList.map((place, idx) => (
                    <option
                      key={`${place.placeId}-${idx}`}
                      value={String(place.placeId)}
                    >
                      {place.placeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">방문 시간</label>
                <input
                  type="datetime-local" // 또는 type="time" + date
                  value={info.visitTime}
                  onChange={(e) =>
                    handleTripInformationChange(
                      index,
                      "visitTime",
                      e.target.value
                    )
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">소요 시간(분)</label>
                <input
                  type="number"
                  value={info.duration}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    handleTripInformationChange(
                      index,
                      "duration",
                      isNaN(num) ? 0 : num
                    );
                  }}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">교통수단</label>
                <select
                  value={info.transportation}
                  onChange={(e) =>
                    handleTripInformationChange(
                      index,
                      "transportation",
                      e.target.value
                    )
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- 교통수단 선택 --</option>
                  {transportationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">비용</label>
                <input
                  type="number"
                  value={info.cost}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    handleTripInformationChange(
                      index,
                      "cost",
                      isNaN(num) ? 0 : num
                    );
                  }}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">메모</label>
                <textarea
                  value={info.notes}
                  onChange={(e) =>
                    handleTripInformationChange(index, "notes", e.target.value)
                  }
                  className="w-full border p-2 rounded"
                  rows={2}
                />
              </div>

              <div>
                <label className="block mb-1">우선순위</label>
                <input
                  type="number"
                  value={info.priority}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    handleTripInformationChange(
                      index,
                      "priority",
                      isNaN(num) ? 0 : num
                    );
                  }}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={info.isVisited}
                  onChange={(e) =>
                    handleTripInformationChange(
                      index,
                      "isVisited",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <label>방문 여부</label>
              </div>

              <button
                type="button"
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                onClick={() => removeTripInformation(index)}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTripInformation}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            세부일정 추가
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
