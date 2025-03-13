// app/member/my/schedule/update/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface TripInformation {
  tripInformationId: number;
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

  useEffect(() => {
    if (!id) return;
    // 여행 일정과 세부 일정 데이터를 함께 불러오기
    fetch(`http://localhost:8080/trip/schedule/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("일정을 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // 세부 일정의 변경사항을 처리하는 함수
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 통합 업데이트 API (백엔드에서 한 번에 처리할 수 있다면)
      const res = await fetch(`http://localhost:8080/trip/schedule/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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
