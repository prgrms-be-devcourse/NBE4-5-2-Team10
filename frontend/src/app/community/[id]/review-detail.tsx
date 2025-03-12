"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Calendar, Eye, MessageSquare, MapPin, ArrowLeft, Edit, Trash2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  images?: string[]
  authorId?: number
  authorTravelStyle?: string
}

interface Comment {
  commentId: number
  content: string
  createdAt: string
  nickname: string
  authorId?: number
}

export default function ReviewDetail({ id }: { id: string }) {
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)

    // In a real app, you would decode the token or fetch user info
    // For demo, we'll set a mock user ID
    setCurrentUserId(1) // Mock user ID
  }, [])

  // Fetch review and comments
  useEffect(() => {
    const fetchReviewAndComments = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        // const reviewResponse = await fetch(`${apiUrl}/review/${id}`);
        // const commentsResponse = await fetch(`${apiUrl}/comment/review/${id}`);

        // Mock data for demonstration
        const mockReview: Review = {
          reviewId: Number.parseInt(id),
          title: "제주도 여행 후기: 자연과 문화의 완벽한 조화",
          content: `제주도는 정말 아름다운 곳이었습니다. 한라산 등반부터 해변 산책까지, 모든 순간이 특별했습니다.
          
          첫째 날에는 성산일출봉을 방문했습니다. 정상에 올라 바라본 전경은 정말 장관이었습니다. 바다와 하늘이 맞닿은 수평선이 끝없이 펼쳐져 있었고, 맑은 공기와 함께 상쾌한 아침을 맞이할 수 있었습니다.
          
          둘째 날에는 우도로 향했습니다. 페리를 타고 약 15분 정도 이동하면 도착하는 작은 섬인데, 자전거를 빌려 섬을 한 바퀴 돌아보았습니다. 에메랄드빛 바다와 하얀 모래사장이 인상적이었습니다.
          
          셋째 날에는 한라산 등반에 도전했습니다. 백록담까지 오르는 길은 쉽지 않았지만, 정상에서 바라본 풍경은 그 모든 노력을 보상받기에 충분했습니다.
          
          마지막 날에는 제주 전통 시장을 방문하여 현지 음식을 맛보았습니다. 특히 흑돼지 바비큐와 해산물 요리는 정말 맛있었습니다.
          
          제주도는 자연과 문화가 완벽하게 조화를 이루는 곳이었습니다. 다음에 또 방문하고 싶은 곳입니다.`,
          rating: 5,
          createdAt: "2023-11-15T09:30:00Z",
          updatedAt: "2023-11-15T10:15:00Z",
          nickname: "여행좋아",
          commentCount: 3,
          viewCount: 128,
          placeId: 1,
          placeName: "제주도",
          images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
          authorId: 1,
          authorTravelStyle: "자연 탐험",
        }

        const mockComments: Comment[] = [
          {
            commentId: 1,
            content: "정말 좋은 리뷰네요! 저도 제주도 여행을 계획 중인데 많은 도움이 되었습니다.",
            createdAt: "2023-11-15T14:25:00Z",
            nickname: "여행계획중",
            authorId: 2,
          },
          {
            commentId: 2,
            content: "한라산 등반 코스는 어떤 걸로 가셨나요? 저도 다음 달에 갈 예정인데 추천해주세요!",
            createdAt: "2023-11-16T08:12:00Z",
            nickname: "산린이",
            authorId: 3,
          },
          {
            commentId: 3,
            content: "사진이 정말 멋지네요! 카메라는 무엇을 사용하셨나요?",
            createdAt: "2023-11-17T19:45:00Z",
            nickname: "사진작가",
            authorId: 4,
          },
        ]

        setReview(mockReview)
        setComments(mockComments)
      } catch (err) {
        console.error("Error fetching review details:", err)
        setError("리뷰를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviewAndComments()
  }, [id])

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.")
      router.push("/member/login")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would submit to your API
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // await fetch(`${apiUrl}/comment`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     reviewId: id,
      //     content: commentText
      //   })
      // });

      // Mock adding a new comment
      const newComment: Comment = {
        commentId: comments.length + 1,
        content: commentText,
        createdAt: new Date().toISOString(),
        nickname: "현재사용자", // In a real app, this would be the current user's nickname
        authorId: currentUserId,
      }

      setComments([...comments, newComment])
      setCommentText("")

      // Update comment count in review
      if (review) {
        setReview({
          ...review,
          commentCount: review.commentCount + 1,
        })
      }
    } catch (err) {
      console.error("Error submitting comment:", err)
      alert("댓글 작성 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle comment edit
  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(content)
  }

  // Handle comment update
  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentText.trim()) return

    try {
      // In a real app, you would update via your API
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // await fetch(`${apiUrl}/comment/${commentId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     content: editCommentText
      //   })
      // });

      // Update comment in state
      setComments(
        comments.map((comment) =>
          comment.commentId === commentId ? { ...comment, content: editCommentText } : comment,
        ),
      )

      setEditingCommentId(null)
      setEditCommentText("")
    } catch (err) {
      console.error("Error updating comment:", err)
      alert("댓글 수정 중 오류가 발생했습니다.")
    }
  }

  // Handle comment delete
  const handleDeleteComment = async (commentId: number) => {
    try {
      // In a real app, you would delete via your API
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // await fetch(`${apiUrl}/comment/${commentId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // });

      // Remove comment from state
      setComments(comments.filter((comment) => comment.commentId !== commentId))

      // Update comment count in review
      if (review) {
        setReview({
          ...review,
          commentCount: review.commentCount - 1,
        })
      }
    } catch (err) {
      console.error("Error deleting comment:", err)
      alert("댓글 삭제 중 오류가 발생했습니다.")
    }
  }

  // Handle review delete
  const handleDeleteReview = async () => {
    try {
      // In a real app, you would delete via your API
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // await fetch(`${apiUrl}/review/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // });

      alert("리뷰가 삭제되었습니다.")
      router.push("/community")
    } catch (err) {
      console.error("Error deleting review:", err)
      alert("리뷰 삭제 중 오류가 발생했습니다.")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return <div className="text-center py-10">리뷰를 불러오는 중...</div>
  }

  if (error || !review) {
    return <div className="text-center py-10 text-red-500">{error || "리뷰를 찾을 수 없습니다."}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/community")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          리뷰 목록으로 돌아가기
        </Button>
      </div>

      {/* Review Card */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Link href={`/place/${review.placeId}`} className="text-sm text-blue-600 hover:underline">
                  {review.placeName}
                </Link>
              </div>
              <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
              <div className="flex items-center mb-1">{renderStars(review.rating)}</div>
            </div>

            {/* Edit/Delete buttons (only visible to author) */}
            {currentUserId === review.authorId && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/community/edit/${review.reviewId}`)}>
                  <Edit className="h-4 w-4 mr-1" />
                  수정
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 리뷰를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteReview}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={review.nickname} />
                <AvatarFallback>{review.nickname.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{review.nickname}</span>
              {review.authorTravelStyle && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {review.authorTravelStyle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Calendar className="h-4 w-4 inline mr-1" />
                <span>{formatDate(review.createdAt)}</span>
              </div>
              <div>
                <Eye className="h-4 w-4 inline mr-1" />
                <span>{review.viewCount}</span>
              </div>
              <div>
                <MessageSquare className="h-4 w-4 inline mr-1" />
                <span>{review.commentCount}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Review content */}
          <div className="prose max-w-none mb-6">
            {review.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {review.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image || "/placeholder.svg"}
                  alt={`${review.title} 이미지 ${idx + 1}`}
                  className="rounded-md w-full h-auto object-cover"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">댓글 {comments.length}개</h2>

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="space-y-6 mb-6">
            {comments.map((comment) => (
              <div key={comment.commentId} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={comment.nickname} />
                      <AvatarFallback>{comment.nickname.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.nickname}</div>
                      <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                    </div>
                  </div>

                  {/* Comment actions (only visible to author) */}
                  {currentUserId === comment.authorId && (
                    <div className="flex gap-2">
                      {editingCommentId === comment.commentId ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleUpdateComment(comment.commentId)}>
                            저장
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingCommentId(null)}>
                            취소
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment.commentId, comment.content)}
                          >
                            수정
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                삭제
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                                <AlertDialogDescription>이 댓글을 정말 삭제하시겠습니까?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteComment(comment.commentId)}>
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {editingCommentId === comment.commentId ? (
                  <Textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{comment.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</div>
        )}

        <Separator className="my-6" />

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-4">
            <Textarea
              placeholder={isLoggedIn ? "댓글을 작성해주세요..." : "댓글을 작성하려면 로그인이 필요합니다."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!isLoggedIn || isSubmitting}
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isLoggedIn || !commentText.trim() || isSubmitting}>
              {isSubmitting ? "등록 중..." : "댓글 등록"}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

