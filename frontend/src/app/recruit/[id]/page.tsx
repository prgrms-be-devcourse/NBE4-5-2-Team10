"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRecruitById } from "@/lib/api/recruit";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = "http://localhost:8080/recruits";
const USER_INFO_URL = "http://localhost:8080/member/mypage";

// 댓글 타입 정의
interface CommentType {
  applyId: number;
  memberProfileImage: string;
  memberNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 모집 상세 타입 정의
interface RecruitDetail {
  recruitId: number;
  memberProfileImage: string;
  memberNickname: string;
  genderRestriction: string;
  ageRestriction: string;
  placeCityName: string;
  placePlaceName: string;
  title: string;
  content: string;
  isClosed: boolean;
  startDate: string;
  endDate: string;
  travelStyle: string;
  budget: number;
  groupSize: number;
  createdAt: string;
  updatedAt: string;
  applies: CommentType[]; // ✅ 댓글 목록 추가
  memberId: number;
  placeId: number;
}

export default function RecruitDetailPage(/*{
  params,
}: {
  params: { id: string };
}*/) {
  //   const [recruit, setRecruit] = useState<RecruitDetail | null>(null);
  const [recruit, setRecruit] = useState<RecruitDetail>({
    recruitId: 0,
    memberProfileImage: "",
    memberNickname: "",
    genderRestriction: "",
    ageRestriction: "",
    placeCityName: "",
    placePlaceName: "",
    title: "",
    content: "",
    isClosed: false,
    startDate: "",
    endDate: "",
    travelStyle: "",
    budget: 0,
    groupSize: 0,
    createdAt: "",
    updatedAt: "",
    applies: [], // ✅ 기본값을 빈 배열로 설정
    memberId: 0,
    placeId: 0,
  });

  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams(); // ✅ Next.js 최신 버전에서는 useParams() 사용
  const recruitId = params.id; // 🔹 비동기적으로 가져오기

  useEffect(() => {
    if (!recruitId) return; // ✅ params.id가 없을 경우 실행하지 않음

    async function fetchRecruit() {
      console.log(recruitId);
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/${recruitId}`);
        if (!response.ok) throw new Error("모집글을 불러오는 데 실패했습니다.");
        const data = await response.json();
        console.log("Fetched recruit data:", data.data); // ✅ 디버깅용 로그
        setRecruit(data.data);
        console.log(recruit);
      } catch (error) {
        console.error("❌ 모집글 조회 오류:", error);
      }
    }

    const fetchMyInfo = async () => {
      try {
        const response = await fetchWithAuth(USER_INFO_URL);
        if (!response.ok) throw new Error("유저 정보를 가져오지 못했습니다.");
        const data = await response.json();
        console.log("Fetched myMemberId:", data.id); // ✅ 디버깅용 로그
        // console.log("Fetched myMemberId:", data.data); // ✅ 디버깅용 로그
        // console.log("Fetched myMemberId:", data.data.memberId); // ✅ 디버깅용 로그
        setMyMemberId(data.id);
      } catch (error) {
        console.error("❌ 유저 정보 조회 오류:", error);
      }
    };

    fetchRecruit();
    fetchMyInfo();
  }, [params.id]);

  useEffect(() => {
    console.log("Updated recruit state:", recruit);
    console.log("Updated myMemberId state:", myMemberId);
  }, [recruit, myMemberId]); // ✅ recruit와 myMemberId가 업데이트될 때 로그 확인

  if (!recruit) return <p>로딩 중...</p>;

  const handleEdit = () => {
    router.push(`/recruit/edit/${recruit.recruitId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/${recruit.recruitId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("삭제 실패");
      alert("삭제 완료!");
      router.push("/recruit/list");
    } catch (error) {
      console.error("❌ 모집글 삭제 오류:", error);
    }
  };

  // 날짜 포맷 함수 (YYYY-MM-DD HH:mm)
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      {/* 제목 */}
      <h2 className="text-3xl font-bold mb-4">{recruit.title}</h2>

      {/* 모집자 정보 */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={recruit.memberProfileImage || "/default-profile.png"}
          alt="프로필 이미지"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-gray-700 font-semibold">
            {recruit.memberNickname}
          </p>
          <p className="text-gray-500 text-sm">
            작성일: {formatDateTime(recruit.createdAt)}
          </p>
          {recruit.createdAt !== recruit.updatedAt && (
            <p className="text-gray-400 text-sm">
              수정됨: {formatDateTime(recruit.updatedAt)}
            </p>
          )}
          {/* 내가 작성한 글일 때만 수정/삭제 버튼 표시 */}
          {recruit &&
            myMemberId !== null &&
            recruit.memberId === myMemberId && (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  삭제
                </button>
              </div>
            )}
        </div>
      </div>

      {/* 모집 정보 */}
      <p className="text-gray-600">
        🗺️ 여행지: {recruit.placeCityName}, {recruit.placePlaceName}
      </p>
      <p className="text-gray-600">
        ⏳ 일정: {recruit.startDate} ~ {recruit.endDate}
      </p>
      <p className="text-gray-600">👥 모집 인원: {recruit.groupSize}명</p>
      <p className="text-gray-600">
        💰 예산: {recruit.budget ? recruit.budget.toLocaleString() : "미정"}원
      </p>
      <p className="text-gray-600">🎒 여행 스타일: {recruit.travelStyle}</p>

      {/* 모집 상태 & 조건 */}
      <div className="mt-4 flex space-x-2">
        {/* 모집 상태 */}
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            recruit.isClosed
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {recruit.isClosed ? "모집 마감" : "모집 중"}
        </span>

        {/* 성별 제한 */}
        {recruit.genderRestriction !== "모든 성별" && (
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            {recruit.genderRestriction}
          </span>
        )}

        {/* 나이 제한 */}
        {recruit.ageRestriction !== "모든 연령대" && (
          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
            {recruit.ageRestriction}
          </span>
        )}
      </div>

      {/* 내용 */}
      <p className="mt-6 text-gray-700 whitespace-pre-line">
        {recruit.content}
      </p>

      {/* 모집 참여 버튼 */}
      <button
        className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={() => alert("모집 참여 기능 구현 필요!")}
      >
        모집 참여하기
      </button>

      {/* ✅ 댓글 목록 */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">💬 댓글</h3>
        {recruit.applies && recruit.applies.length === 0 ? (
          <p className="text-gray-500">아직 댓글이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {recruit.applies.map((comment) => (
              <li
                key={comment.applyId}
                className="p-4 bg-white shadow-md rounded-lg flex items-start space-x-4"
              >
                {/* 댓글 작성자 프로필 */}
                <img
                  src={comment.memberProfileImage || "/default-profile.png"}
                  alt="프로필 이미지"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-700 font-semibold">
                    {comment.memberNickname}
                  </p>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    작성일: {formatDateTime(comment.createdAt)}
                  </p>
                  {comment.createdAt !== comment.updatedAt && (
                    <p className="text-gray-400 text-xs">
                      수정됨: {formatDateTime(comment.updatedAt)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
