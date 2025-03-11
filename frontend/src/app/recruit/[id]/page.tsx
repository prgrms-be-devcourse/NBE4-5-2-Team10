"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecruitById } from "@/lib/api/recruit";

interface RecruitDetail {
  recruitId: number;
  title: string;
  placeCityName: string;
  placePlaceName: string;
  groupSize: number;
  description: string;
  createdAt: string;
}

export default function RecruitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [recruit, setRecruit] = useState<RecruitDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecruit() {
      try {
        const data = await getRecruitById(params.id);
        console.log("📢 모집 상세 정보:", data);
        setRecruit(data.data);
      } catch (error) {
        console.error("❌ 모집 상세 정보를 불러오는 중 오류 발생:", error);
      }
    }

    fetchRecruit();
  }, [params.id]);

  if (!recruit) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold mb-4">{recruit.title}</h2>
      <p className="text-gray-600">
        🗺️ 여행지: {recruit.placeCityName}, {recruit.placePlaceName}
      </p>
      <p className="text-gray-600">👥 모집 인원: {recruit.groupSize}명</p>
      <p className="text-gray-600">
        📅 등록일: {new Date(recruit.createdAt).toLocaleDateString()}
      </p>
      <p className="mt-4">{recruit.description}</p>

      {/* 모집 참여 버튼 */}
      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={() => alert("모집 참여 기능 구현 필요!")}
      >
        모집 참여하기
      </button>
    </div>
  );
}
