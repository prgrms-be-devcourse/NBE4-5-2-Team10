// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { getRecruits, searchAndFilterRecruits } from "@/lib/api/recruit";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// // 모집 글 타입 정의
// interface Recruit {
//   recruitId: number;
//   memberProfileImage: string;
//   memberNickname: string;
//   placeCityName: string;
//   placePlaceName: string;
//   title: string;
//   isClosed: boolean;
//   startDate: string;
//   endDate: string;
//   travelStyle: string;
//   genderRestriction: string;
//   ageRestriction: string;
//   budget: number;
//   groupSize: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function RecruitListPage() {
//   const [recruits, setRecruits] = useState<Recruit[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // 검색 및 필터링 상태
//   const [keyword, setKeyword] = useState("");
//   const [cityName, setCityName] = useState("");
//   const [isClosed, setIsClosed] = useState<string | null>(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [minBudget, setMinBudget] = useState("");
//   const [maxBudget, setMaxBudget] = useState("");
//   const [sortBy, setSortBy] = useState("latest"); // 최신순 기본값

//   useEffect(() => {
//     async function fetchRecruits() {
//       try {
//         const queryParams = {
//           keyword: keyword || undefined,
//           cityName: cityName || undefined,
//           isClosed: isClosed !== null ? isClosed === "true" : undefined,
//           startDate: startDate || undefined,
//           endDate: endDate || undefined,
//           minBudget: minBudget ? Number(minBudget) : undefined,
//           maxBudget: maxBudget ? Number(maxBudget) : undefined,
//           sortBy,
//         };

//         const data = await searchAndFilterRecruits(queryParams);
//         setRecruits(data.data);
//         // const data = await getRecruits();
//         // console.log("📢 API 응답 데이터:", data);
//         // setRecruits(data.data); // API에서 받아온 데이터 저장
//       } catch (error) {
//         console.error("모집 글을 불러오는 중 오류 발생:", error);
//         setError("모집 글을 불러오는 중 오류가 발생했습니다.");
//       }
//     }

//     fetchRecruits();
//   }, [
//     keyword,
//     cityName,
//     isClosed,
//     startDate,
//     endDate,
//     minBudget,
//     maxBudget,
//     sortBy,
//   ]);

//   // 날짜 포맷 함수 (YYYY-MM-DD HH:mm)
//   const formatDateTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("ko-KR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <Header />
//       <h2 className="text-3xl font-bold mb-6">여행 동행 모집</h2>

//       {/* 검색 및 필터 UI */}
//       <div className="bg-white p-4 shadow-md rounded-md mb-6">
//         <input
//           type="text"
//           placeholder="검색어 입력"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md mb-2"
//         />
//         <div className="grid grid-cols-2 gap-2">
//           <input
//             type="text"
//             placeholder="도시 이름"
//             value={cityName}
//             onChange={(e) => setCityName(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//           <select
//             value={isClosed || ""}
//             onChange={(e) => setIsClosed(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           >
//             <option value="">모집 상태</option>
//             <option value="true">모집 마감</option>
//             <option value="false">모집 중</option>
//           </select>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//           <input
//             type="number"
//             placeholder="최소 예산"
//             value={minBudget}
//             onChange={(e) => setMinBudget(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//           <input
//             type="number"
//             placeholder="최대 예산"
//             value={maxBudget}
//             onChange={(e) => setMaxBudget(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="mt-2 p-2 border border-gray-300 rounded-md w-full"
//         >
//           <option value="latest">최신순</option>
//           <option value="budget">예산순</option>
//           <option value="popularity">인기순</option>
//         </select>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       {Array.isArray(recruits) && recruits.length === 0 ? (
//         <p>모집 글이 없습니다.</p>
//       ) : (
//         <ul className="space-y-4">
//           {recruits.map((recruit) => (
//             <li
//               key={recruit.recruitId}
//               className="p-6 bg-white shadow-md rounded-lg flex items-center space-x-4"
//             >
//               {/* 프로필 이미지 */}
//               <img
//                 src={recruit.memberProfileImage || "/default-profile.png"}
//                 alt="프로필 이미지"
//                 className="w-12 h-12 rounded-full object-cover"
//               />

//               {/* 모집 정보 */}
//               <div className="flex-1">
//                 <Link href={`/recruit/${recruit.recruitId}`}>
//                   <h3 className="text-xl font-semibold text-blue-600 hover:underline">
//                     {recruit.title}
//                   </h3>
//                 </Link>
//                 <p className="text-gray-500">👤 {recruit.memberNickname}</p>
//                 <p className="text-gray-600">
//                   🗺️ 여행지: {recruit.placeCityName}, {recruit.placePlaceName}
//                 </p>
//                 <p className="text-gray-600">
//                   ⏳ 일정: {recruit.startDate} ~ {recruit.endDate}
//                 </p>
//                 <p className="text-gray-600">
//                   👥 모집인원: {recruit.groupSize}명
//                 </p>
//                 <p className="text-gray-600">
//                   💰 예산: {recruit.budget.toLocaleString()}원
//                 </p>
//                 <p className="text-gray-600">
//                   🎒 여행 스타일: {recruit.travelStyle}
//                 </p>

//                 {/* 모집 상태 & 제한 조건 */}
//                 <div className="mt-2 flex space-x-2">
//                   {/* 모집 상태 (초록색: 모집 중 / 빨간색: 모집 마감) */}
//                   <span
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       recruit.isClosed
//                         ? "bg-red-100 text-red-600"
//                         : "bg-green-100 text-green-600"
//                     }`}
//                   >
//                     {recruit.isClosed ? "모집 마감" : "모집 중"}
//                   </span>

//                   {/* 성별 제한 */}
//                   {recruit.genderRestriction !== "모든 성별" && (
//                     <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
//                       {recruit.genderRestriction}
//                     </span>
//                   )}

//                   {/* 나이 제한 */}
//                   {recruit.ageRestriction !== "모든 연령대" && (
//                     <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
//                       {recruit.ageRestriction}
//                     </span>
//                   )}
//                 </div>

//                 {/* 생성 & 수정 시간 */}
//                 <div className="mt-2 text-gray-500 text-sm">
//                   <p>🕒 작성: {formatDateTime(recruit.createdAt)}</p>
//                   {recruit.createdAt !== recruit.updatedAt && (
//                     <p className="text-gray-400">
//                       📝 수정됨: {formatDateTime(recruit.updatedAt)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       <Link href="/recruit/create">
//         <button className="fixed bottom-16 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
//           ✏️ 글 작성
//         </button>
//       </Link>

//       <Footer />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { searchAndFilterRecruits } from "@/lib/api/recruit";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 모집 글 타입 정의
interface Recruit {
  recruitId: number;
  memberProfileImage: string;
  memberNickname: string;
  placeCityName: string;
  placePlaceName: string;
  title: string;
  isClosed: boolean;
  startDate: string;
  endDate: string;
  travelStyle: string;
  genderRestriction: string;
  ageRestriction: string;
  budget: number;
  groupSize: number;
  createdAt: string;
  updatedAt: string;
}

export default function RecruitListPage() {
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 검색 및 필터링 상태
  const [keyword, setKeyword] = useState("");
  const [cityName, setCityName] = useState("");
  const [isClosed, setIsClosed] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // 최신순 기본값

  useEffect(() => {
    async function fetchRecruits() {
      try {
        const queryParams = {
          keyword: keyword || undefined,
          cityName: cityName || undefined,
          isClosed: isClosed !== null ? isClosed === "true" : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          minBudget: minBudget ? Number(minBudget) : undefined,
          maxBudget: maxBudget ? Number(maxBudget) : undefined,
          sortBy,
        };

        const data = await searchAndFilterRecruits(queryParams);
        setRecruits(data.data);
      } catch (error) {
        console.error("모집 글을 불러오는 중 오류 발생:", error);
        setError("모집 글을 불러오는 중 오류가 발생했습니다.");
      }
    }

    fetchRecruits();
  }, [
    keyword,
    cityName,
    isClosed,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    sortBy,
  ]);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <Header />
      <h2 className="text-3xl font-bold mb-6">여행 동행 모집</h2>

      {/* 검색 및 필터 UI */}
      <div className="bg-white p-4 shadow-md rounded-md mb-6">
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="도시 이름"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <select
            value={isClosed || ""}
            onChange={(e) => setIsClosed(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">모집 상태</option>
            <option value="true">모집 마감</option>
            <option value="false">모집 중</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="최소 예산"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="최대 예산"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="latest">최신순</option>
          <option value="startDate_asc">출발일 빠른순</option>
          <option value="endDate_desc">도착일 늦은순</option>
          <option value="trip_duration">여행 기간 긴순</option>
          <option value="budget_asc">예산 낮은순</option>
          <option value="budget_desc">예산 높은순</option>
          <option value="groupsize_asc">모집 인원 적은순</option>
          <option value="groupsize_desc">모집 인원 많은순</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(recruits) && recruits.length === 0 ? (
        <p>모집 글이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {recruits.map((recruit) => (
            <li
              key={recruit.recruitId}
              className="p-6 bg-white shadow-md rounded-lg flex items-center space-x-4"
            >
              {/* 프로필 이미지 */}
              <img
                src={recruit.memberProfileImage || "/default-profile.png"}
                alt="프로필 이미지"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* 모집 정보 */}
              <div className="flex-1">
                <Link href={`/recruit/${recruit.recruitId}`}>
                  <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                    {recruit.title}
                  </h3>
                </Link>
                <p className="text-gray-500">👤 {recruit.memberNickname}</p>
                <p className="text-gray-600">
                  🗺️ 여행지: {recruit.placeCityName}, {recruit.placePlaceName}
                </p>
                <p className="text-gray-600">
                  ⏳ 일정: {recruit.startDate} ~ {recruit.endDate}
                </p>
                <p className="text-gray-600">
                  👥 모집인원: {recruit.groupSize}명
                </p>
                <p className="text-gray-600">
                  💰 예산: {recruit.budget.toLocaleString()}원
                </p>
                <p className="text-gray-600">
                  🎒 여행 스타일: {recruit.travelStyle}
                </p>

                {/* 모집 상태 & 제한 조건 */}
                <div className="mt-2 flex space-x-2">
                  {/* 모집 상태 (초록색: 모집 중 / 빨간색: 모집 마감) */}
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

                {/* 생성 & 수정 시간 */}
                <div className="mt-2 text-gray-500 text-sm">
                  <p>🕒 작성: {formatDateTime(recruit.createdAt)}</p>
                  {recruit.createdAt !== recruit.updatedAt && (
                    <p className="text-gray-400">
                      📝 수정됨: {formatDateTime(recruit.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link href="/recruit/create">
        <button className="fixed bottom-16 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
          ✏️ 글 작성
        </button>
      </Link>

      <Footer />
    </div>
  );
}
