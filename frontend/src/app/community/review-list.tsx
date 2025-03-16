"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Star, MessageSquare, Eye, Calendar, MapPin, ChevronLeft, ChevronRight, PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getReviews, Review } from "./services/reviewService"
import { getAllPlaces, getAllCities, getPlacesAsOptions } from "./services/placeService"
import { isLoggedIn } from "./services/authService"

export default function ReviewList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [activeSearchQuery, setActiveSearchQuery] = useState(searchParams.get("query") || "")
  const [destinationFilter, setDestinationFilter] = useState(searchParams.get("destination") || "")
  const [destinations, setDestinations] = useState<{ id: number; name: string }[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const itemsPerPage = 6

  // 로그인 상태 확인
  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  // 여행지 목록 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // 모든 여행지 가져오기
        const places = await getAllPlaces();
        
        // 여행지를 드롭다운 옵션 형태로 변환
        const placeOptions = getPlacesAsOptions(places);
        
        setDestinations(placeOptions);
      } catch (err) {
        console.error("여행지 목록을 불러오는 중 오류가 발생했습니다:", err);
      }
    };

    fetchPlaces();
  }, []);

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      console.log('🚀 리뷰 데이터 로딩 시작');
      
      try {
        // destinationFilter 처리
        let placeId;
        if (destinationFilter && destinationFilter !== 'all') {
          placeId = parseInt(destinationFilter);
          console.log('🏙️ 선택된 장소 ID:', placeId);
        } else {
          console.log('🌍 모든 장소 선택됨');
        }
        
        // 검색어 처리
        const searchTerm = activeSearchQuery && activeSearchQuery.trim() ? activeSearchQuery : undefined;
        if (searchTerm) {
          console.log('🔍 검색어:', searchTerm);
        }
        
        console.log('📊 요청 파라미터:', { 
          sortOption, 
          searchTerm, 
          placeId, 
          currentPage 
        });
        
        // reviewService 호출
        console.log('📡 getReviews 호출 시작');
        const result = await getReviews(
          sortOption,
          searchTerm,
          placeId,
          currentPage
        );
        console.log('📡 getReviews 호출 완료');
        
        // 결과 확인
        if (!result) {
          console.error('⚠️ getReviews 결과가 undefined입니다');
          setReviews([]);
          setTotalPages(1);
          setError("데이터를 받아오지 못했습니다");
          return;
        }
        
        console.log('📦 getReviews 결과:', result);
        
        // reviews 필드 확인
        const { reviews: fetchedReviews = [], totalPages = 1 } = result;
        
        if (!Array.isArray(fetchedReviews)) {
          console.error('⚠️ 리뷰 데이터가 배열이 아닙니다:', fetchedReviews);
          setReviews([]);
          setTotalPages(1);
          setError("데이터 형식이 올바르지 않습니다");
          return;
        }
        
        console.log(`✅ ${fetchedReviews.length}개의 리뷰를 가져왔습니다`);
        console.log('📄 총 페이지 수:', totalPages);
        
        // 상태 업데이트
        setReviews(fetchedReviews);
        setTotalPages(totalPages);
        setError(null);
      } catch (err) {
        console.error('❌ 리뷰 목록을 불러오는 중 오류 발생:', err);
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
        setReviews([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
        console.log('🏁 리뷰 데이터 로딩 완료');
      }
    };
  
    fetchReviews();
  }, [sortOption, activeSearchQuery, destinationFilter, currentPage]);
  // 검색 제출 처리
  const handleSearch = () => {
    // 입력된 검색어를 실제 검색에 사용하는 상태로 설정
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1); // 새 검색 시 첫 페이지로 이동
  };
  

  // URL 파라미터 업데이트
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (sortOption) params.set("sort", sortOption);
    if (activeSearchQuery) params.set("query", activeSearchQuery);
    if (destinationFilter) params.set("destination", destinationFilter);

    router.push(`/community?${params.toString()}`);
  };

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));
  };

  // 날짜 형식 지정
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="text-center py-10">리뷰를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* 필터 및 검색 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Select
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="highest_rating">평점 높은순</SelectItem>
                <SelectItem value="lowest_rating">평점 낮은순</SelectItem>
                <SelectItem value="most_comments">댓글 많은순</SelectItem>
                <SelectItem value="most_viewed">조회수 높은순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select
              value={destinationFilter}
              onValueChange={(value) => {
                setDestinationFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="여행지 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 여행지</SelectItem>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id.toString()}>
                    {destination.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 폼이 자동 제출되지 않도록 `onSubmit`에서 `preventDefault()` 실행 */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); //자동 제출 방지
            handleSearch();
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="리뷰 제목 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default">
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
        </form>
      </div>


      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.map((review) => (
              <Card key={review.reviewId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/community/${review.reviewId}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{review.placeName}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{review.title}</h3>
                    <div className="flex items-center mb-3">{renderStars(review.rating)}</div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{review.content}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="mr-4">
                      <Eye className="h-4 w-4 inline mr-1" />
                      <span>{review.viewCount}</span>
                    </div>
                    <div>
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      <span>{review.commentCount}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{review.memberName}</div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* 리뷰 작성 버튼 */}
      {userLoggedIn && (
        <div className="fixed bottom-8 right-8">
          <Button onClick={() => router.push("/community/write")} className="rounded-full h-14 w-14 shadow-lg">
            <PenSquare className="h-6 w-6" />
            <span className="sr-only">리뷰 작성하기</span>
          </Button>
        </div>
      )}
    </div>
  );
}