"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, Upload, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAllPlaces, Place, getPlacesAsOptions } from "./services/placeService"
import { createReview, getReviewById, updateReview, uploadReviewImages } from "./services/reviewService"
import { isLoggedIn } from "./services/authService"

interface ReviewFormData {
  title: string
  content: string
  rating: number
  placeId: string
  images: File[]
}

interface ReviewFormProps {
  reviewId?: string
}

export default function ReviewForm({ reviewId }: ReviewFormProps) {
  const router = useRouter()
  const isEditMode = !!reviewId

  const [formData, setFormData] = useState<ReviewFormData>({
    title: "",
    content: "",
    rating: 0,
    placeId: "",
    images: [],
  })

  const [places, setPlaces] = useState<Place[]>([])
  const [placeOptions, setPlaceOptions] = useState<{ id: number; name: string }[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoggedInState, setIsLoggedInState] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // 로그인 상태 확인
  useEffect(() => {
    const loggedIn = isLoggedIn()
    setIsLoggedInState(loggedIn)

    if (!loggedIn) {
      setFormError("리뷰를 작성하려면 로그인이 필요합니다.")
    }
  }, [])

  // 여행지 목록 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const fetchedPlaces = await getAllPlaces()
        setPlaces(fetchedPlaces)
        
        const options = getPlacesAsOptions(fetchedPlaces)
        setPlaceOptions(options)
      } catch (err) {
        console.error("여행지 목록을 불러오는 중 오류가 발생했습니다:", err)
        setFormError("여행지 목록을 불러오는 중 오류가 발생했습니다.")
      }
    }

    fetchPlaces()
  }, [])

  // 수정 모드일 경우 리뷰 데이터 가져오기
  useEffect(() => {
    if (isEditMode && reviewId) {
      const fetchReview = async () => {
        try {
          const review = await getReviewById(parseInt(reviewId))
          
          setFormData({
            title: review.title,
            content: review.content,
            rating: review.rating,
            placeId: review.placeId.toString(),
            images: [],
          })
          
          // 이미지 URL이 있다면 프리뷰 이미지 설정
          // 백엔드에서 이미지 URL을 제공하는 경우에만 활성화
          // if (review.images && review.images.length > 0) {
          //   setPreviewImages(review.images);
          // }
        } catch (err) {
          console.error("리뷰 정보를 불러오는 중 오류가 발생했습니다:", err)
          setFormError("리뷰 정보를 불러오는 중 오류가 발생했습니다.")
        }
      }

      fetchReview()
    }
  }, [isEditMode, reviewId])

  // 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // 여행지 선택 처리
  const handleDestinationChange = (value: string) => {
    setFormData({ ...formData, placeId: value })

    // 해당 필드의 에러 제거
    if (errors.placeId) {
      setErrors({ ...errors, placeId: "" })
    }
  }

  // 평점 선택 처리
  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating })

    // 해당 필드의 에러 제거
    if (errors.rating) {
      setErrors({ ...errors, rating: "" })
    }
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)

      // 최대 5개 제한
      if (formData.images.length + newImages.length > 5) {
        alert("최대 5개의 이미지만 업로드할 수 있습니다.")
        return
      }

      // 프리뷰 URL 생성
      const newPreviews = newImages.map((file) => URL.createObjectURL(file))

      setFormData({ ...formData, images: [...formData.images, ...newImages] })
      setPreviewImages([...previewImages, ...newPreviews])
    }
  }

  // 이미지 제거 처리
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images]
    const updatedPreviews = [...previewImages]

    // 메모리 누수 방지를 위해 Object URL 해제
    URL.revokeObjectURL(updatedPreviews[index])

    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setFormData({ ...formData, images: updatedImages })
    setPreviewImages(updatedPreviews)
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요."
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요."
    }

    if (formData.rating === 0) {
      newErrors.rating = "평점을 선택해주세요."
    }

    if (!formData.placeId) {
      newErrors.placeId = "여행지를 선택해주세요."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedInState) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.")
      router.push("/member/login")
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        title: formData.title,
        content: formData.content,
        rating: formData.rating,
        placeId: parseInt(formData.placeId)
      }

      let createdReview;
      
      if (isEditMode && reviewId) {
        // 리뷰 수정
        await updateReview(parseInt(reviewId), reviewData)
        alert("리뷰가 성공적으로 수정되었습니다.")
        createdReview = { reviewId: parseInt(reviewId) }
      } else {
        // 리뷰 생성
        createdReview = await createReview(reviewData)
        alert("리뷰가 성공적으로 등록되었습니다.")
      }

      // 이미지 업로드 (이미지가 있는 경우에만)
      if (formData.images.length > 0 && createdReview && createdReview.reviewId) {
        const imageFormData = new FormData()
        formData.images.forEach(image => {
          imageFormData.append('images', image)
        })
        
        try {
          await uploadReviewImages(createdReview.reviewId, imageFormData)
        } catch (imageError) {
          console.error("이미지 업로드 중 오류 발생:", imageError)
          // 이미지 업로드 실패 시에도 리뷰는 생성/수정되었으므로 계속 진행
        }
      }

      router.push("/community")
    } catch (err) {
      console.error("리뷰 제출 중 오류가 발생했습니다:", err)
      setFormError("리뷰 제출 중 오류가 발생했습니다.")
      setIsSubmitting(false)
    }
  }

  // 컴포넌트 언마운트 시 프리뷰 URL 정리
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])

  return (
    <Card>
      <CardContent className="p-6">
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="리뷰 제목을 입력해주세요"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* 여행지 */}
          <div className="mb-6">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              여행지 <span className="text-red-500">*</span>
            </label>
            <Select value={formData.placeId} onValueChange={handleDestinationChange}>
              <SelectTrigger className={errors.placeId ? "border-red-500" : ""}>
                <SelectValue placeholder="여행지를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {placeOptions.map((place) => (
                  <SelectItem key={place.id} value={place.id.toString()}>
                    {place.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.placeId && <p className="mt-1 text-sm text-red-500">{errors.placeId}</p>}
          </div>

          {/* 평점 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              평점 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => handleRatingChange(star)} className="p-1">
                  <Star
                    className={`h-8 w-8 ${star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="여행 경험을 자세히 공유해주세요"
              className={`min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          </div>

          {/* 이미지 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 (최대 5개)</label>
            <div className="mt-2">
              <label className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">파일 선택</span> 또는 드래그 앤 드롭
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={formData.images.length >= 5}
                />
              </label>
            </div>

            {/* 이미지 프리뷰 */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 제출 및 취소 버튼 */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/community")}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || !isLoggedInState}>
              {isSubmitting ? "제출 중..." : isEditMode ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}