"use client";

import { useEffect, useState } from "react";
import { getRecruits } from "@/lib/api/recruit";
import Link from "next/link";

// 모집 글 타입 정의
interface Recruit {
  recruitId: number;
  title: string;
  placeCityName: string;
  placePlaceName: string;
  groupSize: number;
}

export default function RecruitListPage() {
  const [recruits, setRecruits] = useState<Recruit[]>([]);

  useEffect(() => {
    async function fetchRecruits() {
      try {
        const data = await getRecruits();
        console.log("📢 API 응답 데이터:", data); // ✅ 확인 로그 추가
        setRecruits(data.data); // 데이터 저장
      } catch (error) {
        console.error("모집 글을 불러오는 중 오류 발생:", error);
      }
    }

    fetchRecruits();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold mb-6">여행 동행 모집</h2>

      {recruits.length === 0 ? (
        <p>모집 글이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {recruits.map((recruit) => (
            <li
              key={recruit.recruitId}
              className="p-4 bg-white shadow-md rounded-lg"
            >
              <Link href={`/recruit/${recruit.recruitId}`}>
                <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                  {recruit.title}
                </h3>
              </Link>
              <p className="text-gray-600">
                여행지: {recruit.placeCityName}, {recruit.placePlaceName}
              </p>
              <p className="text-gray-600">모집인원: {recruit.groupSize}명</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
