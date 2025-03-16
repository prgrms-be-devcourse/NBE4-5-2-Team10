"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = "http://localhost:8080/recruits";

// ✅ 여행 스타일 (한글 ↔ 영문 변환)
const travelStyleMap = {
  SIGHTSEEING: "관광",
  RELAXATION: "휴양",
  ADVENTURE: "액티비티",
  GOURMET: "미식",
  SHOPPING: "쇼핑",
};

export default function EditRecruitPage() {
  const router = useRouter();
  const params = useParams();
  const recruitId = params.id;

  const [form, setForm] = useState({
    title: "",
    content: "",
    placeId: 0,
    placeCityName: "",
    placePlaceName: "",
    startDate: "",
    endDate: "",
    travelStyle: "SIGHTSEEING",
    budget: 0,
    groupSize: 2,
    isClosed: false,
    sameGender: false,
    sameAge: false,
  });

  const [loading, setLoading] = useState(true);

  // ✅ 기존 데이터를 API에서 가져오기
  useEffect(() => {
    async function fetchRecruit() {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/${recruitId}`);
        if (!response.ok) throw new Error("기존 모집글을 불러오지 못했습니다.");
        const data = await response.json();

        // ✅ 데이터 변환 (한글 ↔ 영문 여행 스타일)
        setForm({
          title: data.data.title,
          content: data.data.content,
          placeId: data.data.placeId,
          placeCityName: data.data.placeCityName,
          placePlaceName: data.data.placePlaceName,
          startDate: data.data.startDate,
          endDate: data.data.endDate,
          travelStyle:
            Object.keys(travelStyleMap).find(
              (key) => travelStyleMap[key] === data.data.travelStyle
            ) || "SIGHTSEEING",
          budget: data.data.budget,
          groupSize: data.data.groupSize,
          isClosed: data.data.isClosed ?? false, // ✅ undefined 방지
          sameGender: data.data.sameGender ?? false, // ✅ undefined 방지
          sameAge: data.data.sameAge ?? false, // ✅ undefined 방지
        });

        setLoading(false);
      } catch (error) {
        console.error("❌ 기존 모집글 불러오기 오류:", error);
        setLoading(false);
      }
    }

    fetchRecruit();
  }, [recruitId]);

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]:
  //       name === "travelStyle"
  //         ? Object.keys(travelStyleMap).find(
  //             (key) => travelStyleMap[key] === value
  //           ) || "SIGHTSEEING"
  //         : type === "checkbox"
  //         ? checked
  //         : value,
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setForm((prev) => {
  //     const newValue = type === "checkbox" ? checked : value;
  //     console.log(`🔄 변경됨: ${name} =`, newValue); // ✅ 값이 정상적으로 변경되는지 확인
  //     return { ...prev, [name]: newValue };
  //   });
  // };

  // const handleChange = (e) => {
  //   console.log("🟢 체크박스 변경 감지됨!", e.target.name, e.target.checked);

  //   const { name, value, type, checked } = e.target;
  //   setForm((prev) => {
  //     const newValue = type === "checkbox" ? checked : value;
  //     console.log(`🔄 변경됨: ${name} =`, newValue); // ✅ 값이 정상적으로 변경되는지 확인
  //     return { ...prev, [name]: newValue };
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      let newValue;
      if (name === "travelStyle") {
        // 한글 값을 영어 Enum 값으로 변환
        newValue =
          Object.keys(travelStyleMap).find(
            (key) => travelStyleMap[key] === value
          ) || "SIGHTSEEING";
      } else {
        newValue = type === "checkbox" ? checked : value;
      }

      console.log(`🔄 변경됨: ${name} =`, newValue); // ✅ 디버깅용 로그
      return { ...prev, [name]: newValue };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("🚀 전송할 데이터:", JSON.stringify(form, null, 2)); // ✅ 실제 요청 데이터 확인

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/${recruitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: form.placeId,
          title: form.title,
          content: form.content,
          isClosed: form.isClosed,
          startDate: form.startDate,
          endDate: form.endDate,
          travelStyle: form.travelStyle,
          sameGender: form.sameGender,
          sameAge: form.sameAge,
          budget: Number(form.budget),
          groupSize: Number(form.groupSize),
        }),
      });

      if (!response.ok) throw new Error("모집글 수정에 실패했습니다.");

      router.push(`/recruit/${recruitId}`);
    } catch (error) {
      console.error("❌ 모집글 수정 오류:", error);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50 max-w-xl mx-auto">
      <Header />
      <h2 className="text-3xl font-bold mb-6">동행 모집 글 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="내용"
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <p className="text-gray-600">
          📍 여행지: {form.placeCityName}, {form.placePlaceName}
        </p>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="travelStyle"
          value={travelStyleMap[form.travelStyle]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {Object.entries(travelStyleMap).map(([key, label]) => (
            <option key={key} value={label}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="budget"
          placeholder="예산 (원)"
          value={form.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="groupSize"
          placeholder="모집 인원"
          value={form.groupSize}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label>
          <input
            type="checkbox"
            name="isClosed"
            checked={form.isClosed}
            onChange={handleChange}
          />
          모집 마감
        </label>
        <label>
          <input
            type="checkbox"
            name="sameGender"
            checked={form.sameGender}
            onChange={handleChange}
          />
          동성끼리만 모집
        </label>
        <label>
          <input
            type="checkbox"
            name="sameAge"
            checked={form.sameAge}
            onChange={handleChange}
          />
          동일 연령대만 모집
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          수정 완료
        </button>
      </form>
      <Footer />
    </div>
  );
}
