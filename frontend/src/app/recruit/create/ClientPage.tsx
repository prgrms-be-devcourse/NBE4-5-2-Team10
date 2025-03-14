"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = "http://localhost:8080/recruits";
const PLACE_API_URL = "http://localhost:8080/place";

export default function CreateRecruitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    placeId: 0, // 여행지 ID
    startDate: "",
    endDate: "",
    travelStyle: "SIGHTSEEING", // 기본값
    budget: "",
    groupSize: "",
    sameGender: false,
    sameAge: false,
  });
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  interface Place {
    id: number;
    placeName: string;
    cityName: string;
  }

  const handlePlaceSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setPlaceQuery(query);
    if (!query) return setPlaceResults([]);

    try {
      const response = await fetch(`${PLACE_API_URL}`);
      if (!response.ok) throw new Error("장소 목록을 불러올 수 없습니다.");
      const data = await response.json();
      const filteredPlaces = data.data.filter((place: Place) =>
        place.placeName.toLowerCase().includes(query.toLowerCase())
      );
      setPlaceResults(filteredPlaces);
    } catch (error) {
      console.error("❌ 장소 검색 오류:", error);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setForm((prev) => ({ ...prev, placeId: place.id }));
    setPlaceQuery(place.placeName);
    setPlaceResults([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetchWithAuth(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          groupSize: Number(form.groupSize),
        }),
      });

      if (!response.ok) throw new Error("모집글 작성에 실패했습니다.");

      router.push("/recruit/list");
    } catch (error) {
      console.error("❌ 모집글 작성 오류:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 max-w-xl mx-auto">
      {/* 헤더 컴포넌트 사용 */}
      <Header />
      <h2 className="text-3xl font-bold mb-6">동행 모집 글 작성</h2>
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

        <div className="relative">
          <input
            type="text"
            placeholder="여행지 검색"
            value={placeQuery}
            onChange={handlePlaceSearch}
            // onFocus={handlePlaceSearch} // ⬅️ 클릭하면 검색 실행
            className="w-full p-2 border rounded"
            required
          />
          {placeResults.length > 0 && (
            <ul className="absolute bg-white border mt-1 w-full z-10 max-h-40 overflow-auto">
              {placeResults.map((place: Place) => (
                <li
                  key={place.id}
                  onClick={() => handlePlaceSelect(place)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {place.placeName} ({place.cityName})
                </li>
              ))}
            </ul>
          )}
        </div>

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
          value={form.travelStyle}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="SIGHTSEEING">관광</option>
          <option value="RELAXATION">휴양</option>
          <option value="ADVENTURE">액티비티</option>
          <option value="GOURMET">미식</option>
          <option value="SHOPPING">쇼핑</option>
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="sameGender"
            checked={form.sameGender}
            onChange={handleChange}
          />
          <span>동성끼리만 모집</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="sameAge"
            checked={form.sameAge}
            onChange={handleChange}
          />
          <span>동일 연령대만 모집</span>
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          작성 완료
        </button>
      </form>
      {/* 푸터 컴포넌트 사용 */}
      <Footer />
    </div>
  );
}
