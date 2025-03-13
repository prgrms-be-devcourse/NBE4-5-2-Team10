"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface TripInformation {
  tripInformationId: number;
  placeId?: number; // 추가: API로부터 조회된 placeId
  placeName: string;
  cityName: string;
  visitTime: string;
  duration: number;
  transportation: string;
  cost: number;
  notes: string;
  visited: boolean;
}

interface TripSchedule {
  id: number;
  title: string;
  cityName: string;
  description: string;
  startDate: string;
  endDate: string;
  tripInformations: TripInformation[];
}

export default function CombinedUpdatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<TripSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출: 일정 데이터 가져오기
  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/trip/schedule/my-schedules/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      // 기존 GET 응답 처리 부분 수정
      .then((result) => {
        if (result.data && result.data.length > 0) {
          // 백엔드 응답에서 세부 일정에 tripInformationId가 없으면, 대신 id를 사용하도록 매핑
          const scheduleData = result.data[0];
          if (scheduleData.tripInformations) {
            scheduleData.tripInformations = scheduleData.tripInformations.map(
              (info: any) => ({
                tripInformationId: info.id ?? info.tripInformationId, // id가 있다면 사용, 없으면 원래 값
                ...info,
              })
            );
          }
          setFormData(scheduleData);
        } else {
          setError("일정 데이터를 찾을 수 없습니다.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("일정을 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, [id]);

  // 기본 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // 세부 일정 변경 처리
  const handleTripInfoChange = (
    index: number,
    field: keyof TripInformation,
    value: any
  ) => {
    if (!formData) return;
    const updatedTripInformations = formData.tripInformations.map(
      (info, idx) => {
        if (idx === index) {
          return { ...info, [field]: value };
        }
        return info;
      }
    );
    setFormData({ ...formData, tripInformations: updatedTripInformations });
  };

  // 장소명 입력 후 onBlur 이벤트를 통해 API 호출하여 placeId를 업데이트
  const handlePlaceNameBlur = async (index: number, placeName: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/trip/place/search?cityName=${encodeURIComponent(
          placeName
        )}`
      );
      const result = await res.json();
      // result.data에 검색 결과 배열이 있다고 가정
      if (result.data && result.data.length > 0) {
        const placeId = result.data[0].placeId; // 첫 번째 결과 사용
        handleTripInfoChange(index, "placeId", placeId);
      } else {
        // 결과가 없으면 별도 처리
      }
    } catch (err) {
      console.error("장소 검색 실패", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!formData) return;
    // TripUpdateReqDto 형식에 맞게 페이로드 재구성
    const payload = {
      tripScheduleId: formData.id,
      scheduleUpdate: {
        title: formData.title,
        cityName: formData.cityName,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      tripInformationUpdates: formData.tripInformations.map((info) => ({
        tripInformationId: info.tripInformationId,
        placeId: info.placeId,
        visitTime: info.visitTime,
        duration: info.duration,
        transportation: info.transportation,
        cost: info.cost,
        notes: info.notes,
        isVisited: info.visited,
      })),
    };

    try {
      const res = await fetch(`http://localhost:8080/trip/schedule/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("반환값:", payload);
      if (!res.ok) throw new Error("수정에 실패했습니다.");
      router.push(`/member/my/schedule/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">여행 일정 및 세부 일정 수정</h1>

      <fieldset className="mb-6 border p-4">
        <legend className="font-bold mb-2">여행 일정</legend>
        <label className="block mb-2">
          제목:
          <input
            name="title"
            type="text"
            value={formData?.title || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          도시:
          <input
            name="cityName"
            type="text"
            value={formData?.cityName || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          설명:
          <textarea
            name="description"
            value={formData?.description || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          시작일:
          <input
            name="startDate"
            type="date"
            value={formData?.startDate || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          종료일:
          <input
            name="endDate"
            type="date"
            value={formData?.endDate || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
      </fieldset>

      <fieldset className="mb-6 border p-4">
        <legend className="font-bold mb-2">세부 일정</legend>
        {formData?.tripInformations.map((info, index) => (
          <div key={info.tripInformationId} className="mb-4 p-2 border-b">
            <h3 className="font-semibold mb-2">세부 일정 {index + 1}</h3>
            <label className="block mb-2">
              장소 이름:
              <input
                type="text"
                value={info.placeName}
                onChange={(e) =>
                  handleTripInfoChange(index, "placeName", e.target.value)
                }
                onBlur={() => handlePlaceNameBlur(index, info.placeName)}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              도시:
              <input
                type="text"
                value={info.cityName}
                onChange={(e) =>
                  handleTripInfoChange(index, "cityName", e.target.value)
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              방문 시간:
              <input
                type="datetime-local"
                value={info.visitTime}
                onChange={(e) =>
                  handleTripInfoChange(index, "visitTime", e.target.value)
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              소요 시간(시간):
              <input
                type="number"
                value={info.duration}
                onChange={(e) =>
                  handleTripInfoChange(
                    index,
                    "duration",
                    Number(e.target.value)
                  )
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              이동 수단:
              <input
                type="text"
                value={info.transportation}
                onChange={(e) =>
                  handleTripInfoChange(index, "transportation", e.target.value)
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              비용:
              <input
                type="number"
                value={info.cost}
                onChange={(e) =>
                  handleTripInfoChange(index, "cost", Number(e.target.value))
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              메모:
              <textarea
                value={info.notes}
                onChange={(e) =>
                  handleTripInfoChange(index, "notes", e.target.value)
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              방문 여부:
              <select
                value={info.visited ? "true" : "false"}
                onChange={(e) =>
                  handleTripInfoChange(
                    index,
                    "visited",
                    e.target.value === "true"
                  )
                }
                className="border p-2 w-full"
              >
                <option value="true">방문 완료</option>
                <option value="false">방문 예정</option>
              </select>
            </label>
          </div>
        ))}
      </fieldset>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        수정 완료
      </button>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/member/my/schedule")}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          뒤로 가기
        </button>
      </div>
    </form>
  );
}
