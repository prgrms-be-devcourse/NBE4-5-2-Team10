"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { searchAndFilterRecruits } from "@/lib/api/recruit";
import { getCities } from "@/lib/api/place";
import { fetchWithAuth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  PenSquare,
  Users,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const USER_INFO_URL = "http://localhost:8080/member/mypage";

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
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 검색 및 필터링 상태
  const [keyword, setKeyword] = useState("");
  const [cityName, setCityName] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isClosed, setIsClosed] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [minGroupSize, setMinGroupSize] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>("");
  const [userGender, setUserGender] = useState<string | null>(null);
  const [sameGender, setSameGender] = useState<string>("all");
  const [sameAge, setSameAge] = useState<string>("all");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchMyInfo = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("🚫 로그인하지 않은 사용자입니다.");
      return;
    }

    try {
      const response = await fetchWithAuth(USER_INFO_URL);
      const data = await response.json();
      if (!response.ok || !data.data.gender) {
        throw new Error("유저 정보를 가져오지 못했습니다.");
      }

      setUserGender(data.data.gender);
      console.log("📢 로그인한 사용자 성별:", data.data.gender);
    } catch (error) {
      console.error("❌ 유저 정보 조회 오류:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMyInfo();
    }, 500); // ⏳ 500ms 동안 입력이 멈추면 실행

    return () => clearTimeout(delayDebounceFn); // 🔄 입력할 때마다 이전 요청 취소
  }, []);

  // 도시 목록 불러오기
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchCities() {
        try {
          const data = await getCities();
          setCities(data.data);
        } catch (error) {
          console.error("도시 목록 불러오기 실패:", error);
        }
      }
      fetchCities();
    }, 500); // ⏳ 500ms 동안 입력이 멈추면 실행

    return () => clearTimeout(delayDebounceFn); // 🔄 입력할 때마다 이전 요청 취소
  }, []);

  // 도시 입력할 때 자동완성 리스트 필터링
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (cityName) {
        const filtered = cities.filter((city) =>
          city.toLowerCase().includes(cityName.toLowerCase())
        );
        setFilteredCities(filtered);
      } else {
        setFilteredCities([]);
      }
    }, 500); // ⏳ 500ms 동안 입력이 멈추면 실행

    return () => clearTimeout(delayDebounceFn); // 🔄 입력할 때마다 이전 요청 취소
  }, [cityName, cities]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchRecruits() {
        setLoading(true);
        if (sameGender === "same" && !userGender) {
          setLoading(false);
          return;
        }
        try {
          const queryParams = {
            keyword: keyword || undefined,
            cityName: cityName || undefined,
            isClosed: isClosed !== null ? isClosed === "true" : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            minBudget: minBudget ? Number(minBudget) : undefined,
            maxBudget: maxBudget ? Number(maxBudget) : undefined,
            minGroupSize: minGroupSize ? Number(minGroupSize) : undefined,
            maxGroupSize: maxGroupSize ? Number(maxGroupSize) : undefined,
            travelStyle: selectedTravelStyle || undefined,
            sameGender: sameGender === "same" ? true : undefined,
            sameAge: sameAge === "same" ? true : undefined,
            sortBy,
          };

          console.log("🔹 API 요청 파라미터:", queryParams);

          const data = await searchAndFilterRecruits(queryParams);
          setRecruits(data.data);
          setTotalPages(Math.ceil(data.data.length / itemsPerPage));
        } catch (error) {
          console.error("모집 글을 불러오는 중 오류 발생:", error);
          setError("모집 글을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      }

      fetchRecruits();
    }, 500); // ⏳ 500ms 동안 입력이 멈추면 실행

    return () => clearTimeout(delayDebounceFn); // 🔄 입력할 때마다 이전 요청 취소
  }, [
    keyword,
    cityName,
    isClosed,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    minGroupSize,
    maxGroupSize,
    selectedTravelStyle,
    sameGender,
    userGender,
    sameAge,
    sortBy,
  ]);

  // 날짜 포맷 함수 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 페이지네이션된 모집글 가져오기
  const getPaginatedRecruits = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return recruits.slice(startIndex, endIndex);
  };

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색 제출 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // 여행 스타일 한글화
  const getTravelStyleKorean = (style: string) => {
    const styles = {
      SIGHTSEEING: "관광",
      RELAXATION: "휴양",
      ADVENTURE: "액티비티",
      GOURMET: "미식",
      SHOPPING: "쇼핑",
    };
    return styles[style as keyof typeof styles] || style;
  };

  if (loading) {
    return <div className="text-center py-10">모집글을 불러오는 중...</div>;
  }

  // 날짜 포맷 함수 (YYYY.MM.DD HH:mm)
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Header />
      <h2 className="text-3xl font-bold mb-6">여행 동행 모집</h2>

      {/* 검색 및 필터 UI */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="검색어 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="default">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="도시 이름 검색"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full"
              />
              {filteredCities.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md max-h-40 overflow-y-auto z-10">
                  {filteredCities.map((city) => (
                    <li
                      key={city}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setCityName(city);
                        setFilteredCities([]);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Select
              value={isClosed || ""}
              onValueChange={(value) => setIsClosed(value)}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm">
                <SelectValue placeholder="모집 상태" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="true">모집 마감</SelectItem>
                <SelectItem value="false">모집 중</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedTravelStyle}
              onValueChange={(value) => setSelectedTravelStyle(value)}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm">
                <SelectValue placeholder="여행 스타일" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="SIGHTSEEING">관광</SelectItem>
                <SelectItem value="RELAXATION">휴양</SelectItem>
                <SelectItem value="ADVENTURE">액티비티</SelectItem>
                <SelectItem value="GOURMET">미식</SelectItem>
                <SelectItem value="SHOPPING">쇼핑</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">출발일</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">도착일</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">모집 인원</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="최소"
                  value={minGroupSize}
                  onChange={(e) => setMinGroupSize(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="최대"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">예산 (원)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="최소"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="최대"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={sameGender}
              onValueChange={(value) => setSameGender(value)}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm">
                <SelectValue placeholder="성별 필터" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">전체 성별</SelectItem>
                <SelectItem value="same">내 성별만</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sameAge}
              onValueChange={(value) => setSameAge(value)}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm">
                <SelectValue placeholder="연령대 필터" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">전체 연령대</SelectItem>
                <SelectItem value="same">내 연령대만</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="startDate_asc">출발일 빠른순</SelectItem>
                <SelectItem value="endDate_desc">도착일 늦은순</SelectItem>
                <SelectItem value="trip_duration">여행 기간 긴순</SelectItem>
                <SelectItem value="budget_asc">예산 낮은순</SelectItem>
                <SelectItem value="budget_desc">예산 높은순</SelectItem>
                <SelectItem value="groupsize_asc">모집 인원 적은순</SelectItem>
                <SelectItem value="groupsize_desc">모집 인원 많은순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 모집 글 리스트 */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : recruits.length === 0 ? (
        <p className="text-center text-gray-500">모집 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getPaginatedRecruits().map((recruit) => (
            <Card key={recruit.recruitId} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={recruit.memberProfileImage || "/default-profile.png"}
                    alt="프로필 이미지"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {recruit.memberNickname}
                    </p>
                    <p className="text-xs text-gray-500">
                      작성: {formatDateTime(recruit.createdAt)}
                    </p>
                    {recruit.createdAt !== recruit.updatedAt && (
                      <p className="text-xs text-gray-400">
                        (수정됨: {formatDateTime(recruit.updatedAt)})
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{recruit.title}</h3>

                {/* 🚀 추가: 성별/연령 필터 표시 */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {
                    // recruit.genderRestriction != "알 수 없음" &&
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                      {recruit.genderRestriction}
                    </span>
                  }
                  {
                    // recruit.sameAge &&
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                      {recruit.ageRestriction}
                    </span>
                  }
                </div>

                <div className="space-y-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>
                      {recruit.placeCityName}, {recruit.placePlaceName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>
                      {recruit.startDate} ~ {recruit.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>모집 인원: {recruit.groupSize}명</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span>
                      {recruit.budget
                        ? `${recruit.budget.toLocaleString()}원`
                        : "미정"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-500" />
                    <span>{getTravelStyleKorean(recruit.travelStyle)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button asChild>
                  <Link href={`/recruit/${recruit.recruitId}`}>
                    자세히 보기
                  </Link>
                </Button>
                {recruit.isClosed ? (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    모집 마감
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    모집 중
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
          {/* {getPaginatedRecruits().map((recruit) => (
            <Card key={recruit.recruitId} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={recruit.memberProfileImage || "/default-profile.png"}
                    alt="프로필 이미지"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {recruit.memberNickname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(recruit.createdAt)}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{recruit.title}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>
                      {recruit.placeCityName}, {recruit.placePlaceName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>
                      {recruit.startDate} ~ {recruit.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>모집 인원: {recruit.groupSize}명</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span>
                      {recruit.budget
                        ? `${recruit.budget.toLocaleString()}원`
                        : "미정"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-500" />
                    <span>{getTravelStyleKorean(recruit.travelStyle)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button asChild>
                  <Link href={`/recruit/${recruit.recruitId}`}>
                    자세히 보기
                  </Link>
                </Button>
                {recruit.isClosed ? (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    모집 마감
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    모집 중
                  </span>
                )}
              </CardFooter>
            </Card>
          ))} */}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <span className="text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 글 작성 버튼 */}
      <Link href="/recruit/create">
        <Button className="fixed bottom-16 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
          <PenSquare className="h-5 w-5 mr-2" />
          모집 글 작성
        </Button>
      </Link>

      <Footer />
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { searchAndFilterRecruits } from "@/lib/api/recruit";
// import { getCities } from "@/lib/api/place"; // 도시 목록 불러오는 API 추가
// import { fetchWithAuth } from "@/lib/auth";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// const USER_INFO_URL = "http://localhost:8080/member/mypage";

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
//   const [cities, setCities] = useState<string[]>([]); // 도시 목록 상태 추가

//   // 검색 및 필터링 상태
//   const [keyword, setKeyword] = useState("");
//   const [cityName, setCityName] = useState("");
//   const [filteredCities, setFilteredCities] = useState<string[]>([]); // 검색된 도시 목록
//   const [isClosed, setIsClosed] = useState<string | null>(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [minBudget, setMinBudget] = useState("");
//   const [maxBudget, setMaxBudget] = useState("");
//   const [sortBy, setSortBy] = useState("latest"); // 최신순 기본값
//   const [minGroupSize, setMinGroupSize] = useState("");
//   const [maxGroupSize, setMaxGroupSize] = useState("");
//   const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>("");
//   const [userGender, setUserGender] = useState<string | null>(null);
//   const [sameGender, setSameGender] = useState<string>("all"); // 기본값: 전체 성별
//   const [sameAge, setSameAge] = useState<string>("all"); // 기본값: 전체 연령대

//   const fetchMyInfo = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       console.warn("🚫 로그인하지 않은 사용자입니다.");
//       return;
//     }

//     try {
//       const response = await fetchWithAuth(USER_INFO_URL);
//       const data = await response.json();
//       if (!response.ok || !data.data.gender) {
//         throw new Error("유저 정보를 가져오지 못했습니다.");
//       }

//       setUserGender(data.data.gender); // ✅ 성별 정보 저장 (MALE 또는 FEMALE)
//       console.log("📢 로그인한 사용자 성별:", data.data.gender); // ✅ 디버깅용 로그
//       // setMyMemberId(data.data.id); // ✅ 기존 myMemberId 설정도 유지
//       // fetchRecruits();
//     } catch (error) {
//       console.error("❌ 유저 정보 조회 오류:", error);
//     }
//   };

//   const handleTravelStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTravelStyle(e.target.value);
//   };

//   const handleGenderFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSameGender(e.target.value);
//   };

//   useEffect(() => {
//     // ✅ 로그인한 사용자 정보 가져오기 (최초 1회 실행)
//     fetchMyInfo();
//   }, []);

//   // 도시 목록 불러오기
//   useEffect(() => {
//     async function fetchCities() {
//       try {
//         const data = await getCities();
//         setCities(data.data); // 도시 목록 상태 업데이트
//       } catch (error) {
//         console.error("도시 목록 불러오기 실패:", error);
//       }
//     }
//     fetchCities();
//   }, []);

//   // 도시 입력할 때 자동완성 리스트 필터링
//   useEffect(() => {
//     if (cityName) {
//       const filtered = cities.filter((city) =>
//         city.toLowerCase().includes(cityName.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//   }, [cityName, cities]);

//   useEffect(() => {
//     async function fetchRecruits() {
//       if (sameGender === "same" && !userGender) {
//         return; // ✅ 성별 정보가 없으면 실행하지 않음
//       }
//       try {
//         const queryParams = {
//           keyword: keyword || undefined,
//           cityName: cityName || undefined,
//           isClosed: isClosed !== null ? isClosed === "true" : undefined,
//           startDate: startDate || undefined,
//           endDate: endDate || undefined,
//           minBudget: minBudget ? Number(minBudget) : undefined,
//           maxBudget: maxBudget ? Number(maxBudget) : undefined,
//           minGroupSize: minGroupSize ? Number(minGroupSize) : undefined,
//           maxGroupSize: maxGroupSize ? Number(maxGroupSize) : undefined,
//           travelStyle: selectedTravelStyle || undefined, // ✅ 기본값(전체)일 경우 undefined
//           sameGender: sameGender === "same" ? true : undefined, // ✅ 수정 (boolean 값으로 변경)
//           sameAge: sameAge === "same" ? true : undefined, // ✅ sameAge 추가 🔥
//           sortBy,
//         };

//         console.log("🔹 API 요청 파라미터:", queryParams); // ✅ 디버깅용 로그

//         const data = await searchAndFilterRecruits(queryParams);
//         setRecruits(data.data);
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
//     minGroupSize, // ✅ 추가
//     maxGroupSize, // ✅ 추가
//     selectedTravelStyle, // ✅ 추가
//     sameGender, // ✅ 추가
//     userGender, // ✅ userGender가 변경될 때도 fetchRecruits 실행!
//     sameAge,
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
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="도시 이름 검색"
//             value={cityName}
//             onChange={(e) => setCityName(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
//           {/* 자동완성된 도시 리스트 */}
//           {filteredCities.length > 0 && (
//             <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md max-h-40 overflow-y-auto">
//               {filteredCities.map((city) => (
//                 <li
//                   key={city}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => {
//                     setCityName(city);
//                     setFilteredCities([]); // 리스트 닫기
//                   }}
//                 >
//                   {city}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="grid grid-cols-2 gap-2">
//           <select
//             value={isClosed || ""}
//             onChange={(e) => setIsClosed(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           >
//             <option value="">모집 상태</option>
//             <option value="true">모집 마감</option>
//             <option value="false">모집 중</option>
//           </select>
//           <select
//             value={selectedTravelStyle}
//             onChange={handleTravelStyleChange}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">여행 스타일</option> {/* 기본값: 전체 */}
//             <option value="SIGHTSEEING">관광</option>
//             <option value="RELAXATION">휴양</option>
//             <option value="ADVENTURE">액티비티</option>
//             <option value="GOURMET">미식</option>
//             <option value="SHOPPING">쇼핑</option>
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
//           <input
//             type="number"
//             placeholder="최소 모집 인원"
//             value={minGroupSize}
//             onChange={(e) => setMinGroupSize(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//           <input
//             type="number"
//             placeholder="최대 모집 인원"
//             value={maxGroupSize}
//             onChange={(e) => setMaxGroupSize(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <select
//           value={sameGender}
//           onChange={handleGenderFilterChange}
//           className="w-full p-2 border rounded mb-2"
//         >
//           <option value="all">전체 성별</option>
//           <option value="same">내 성별만</option> {/* ✅ same 선택 시 true */}
//         </select>
//         <select
//           value={sameAge}
//           onChange={(e) => setSameAge(e.target.value)}
//           className="w-full p-2 border rounded mb-2"
//         >
//           <option value="all">전체 연령대</option>
//           <option value="same">내 연령대만</option> {/* ✅ same 선택 시 true */}
//         </select>
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="mt-2 p-2 border border-gray-300 rounded-md w-full"
//         >
//           <option value="latest">최신순</option>
//           <option value="startDate_asc">출발일 빠른순</option>
//           <option value="endDate_desc">도착일 늦은순</option>
//           <option value="trip_duration">여행 기간 긴순</option>
//           <option value="budget_asc">예산 낮은순</option>
//           <option value="budget_desc">예산 높은순</option>
//           <option value="groupsize_asc">모집 인원 적은순</option>
//           <option value="groupsize_desc">모집 인원 많은순</option>
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
