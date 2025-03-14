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
import { reviewAPI, placeAPI } from "./utils/api"

interface Review {
  reviewId: number
  title: string
  content: string
  rating: number
  createdAt: string
  updatedAt?: string
  nickname: string
  commentCount: number
  viewCount: number
  placeId: number
  placeName?: string
}

interface Place {
  id: number
  name: string
}

export default function ReviewList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [destinationFilter, setDestinationFilter] = useState(searchParams.get("destination") || "all")
  const [destinations, setDestinations] = useState<Place[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  // 장소 목록 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const places = await placeAPI.getPlaces()
        setDestinations(places)
      } catch (err) {
        console.error("Error fetching places:", err)
      }
    }

    fetchPlaces()
  }, [])

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const params: any = { sort: sortOption }

        if (searchQuery) {
          params.keyword = searchQuery
        }

        if (destinationFilter && destinationFilter !== "all") {
          params.placeId = Number.parseInt(destinationFilter)
        }

        const reviewsData = await reviewAPI.getReviews(params)

        // 장소 이름 매핑
        const reviewsWithPlaceNames = reviewsData.map((review: any) => {
          const place = destinations.find((d) => d.id === review.placeId)
          return {
            ...review,
            placeName: place ? place.name : "알 수 없는 장소",
          }
        })

        setReviews(reviewsWithPlaceNames)
        setTotalPages(Math.ceil(reviewsWithPlaceNames.length / itemsPerPage))
      } catch (err: any) {
        console.error("Error fetching reviews:", err)
        setError(err.message || "리뷰를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [sortOption, searchQuery, destinationFilter, destinations])

  // 검색 제출 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams()
  }

  // URL 파라미터 업데이트
  const updateUrlParams = () => {
    const params = new URLSearchParams()
    if (sortOption) params.set("sort", sortOption)
    if (searchQuery) params.set("query", searchQuery)
    if (destinationFilter && destinationFilter !== "all") params.set("destination", destinationFilter)
    router.push(`/community?${params.toString()}`)
  }

  // 페이지네이션된 리뷰 가져오기
  const getPaginatedReviews = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return reviews.slice(startIndex, endIndex)
  }

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
  }

  if (loading) {
    return <div className="text-center py-10">리뷰를 불러오는 중...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
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
                setSortOption(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm z-10">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="newest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="highest_rating">평점 높은순</SelectItem>
                <SelectItem value="lowest_rating">평점 낮은순</SelectItem>
                <SelectItem value="comments">댓글 많은순</SelectItem>
                <SelectItem value="most_viewed">조회수 높은순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select
              value={destinationFilter}
              onValueChange={(value) => {
                setDestinationFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full bg-white text-gray-700 shadow-sm z-10">
                <SelectValue placeholder="여행지 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
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

        <form onSubmit={handleSearch} className="flex gap-2">
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
            {getPaginatedReviews().map((review) => (
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
                  <div className="text-sm text-gray-600">{review.nickname}</div>
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
      <div className="fixed bottom-8 right-8">
        <Button onClick={() => router.push("/community/write")} className="rounded-full h-14 w-14 shadow-lg">
          <PenSquare className="h-6 w-6" />
          <span className="sr-only">리뷰 작성하기</span>
        </Button>
      </div>
    </div>
  )
}

