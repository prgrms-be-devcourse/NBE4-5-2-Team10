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

interface Destination {
  id: number
  name: string
}

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

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)

    if (!token) {
      setFormError("리뷰를 작성하려면 로그인이 필요합니다.")
    }
  }, [])

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // In a real app, you would fetch from your API
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        // const response = await fetch(`${apiUrl}/place`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockDestinations: Destination[] = [
          { id: 1, name: "제주도" },
          { id: 2, name: "방콕" },
          { id: 3, name: "오사카" },
          { id: 4, name: "파리" },
          { id: 5, name: "뉴욕" },
        ]

        setDestinations(mockDestinations)
      } catch (err) {
        console.error("Error fetching destinations:", err)
      }
    }

    fetchDestinations()
  }, [])

  // Fetch review data if in edit mode
  useEffect(() => {
    if (isEditMode && reviewId) {
      const fetchReview = async () => {
        try {
          // In a real app, you would fetch from your API
          // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          // const response = await fetch(`${apiUrl}/review/${reviewId}`);
          // const data = await response.json();

          // Mock data for demonstration
          const mockReview = {
            reviewId: Number.parseInt(reviewId),
            title: "제주도 여행 후기: 자연과 문화의 완벽한 조화",
            content: "제주도는 정말 아름다운 곳이었습니다. 한라산 등반부터 해변 산책까지, 모든 순간이 특별했습니다.",
            rating: 5,
            placeId: "1",
            images: [],
          }

          setFormData({
            title: mockReview.title,
            content: mockReview.content,
            rating: mockReview.rating,
            placeId: mockReview.placeId,
            images: [],
          })

          // If there were image URLs, you would set them as previews
          // setPreviewImages(mockReview.imageUrls);
        } catch (err) {
          console.error("Error fetching review:", err)
          setFormError("리뷰 정보를 불러오는 중 오류가 발생했습니다.")
        }
      }

      fetchReview()
    }
  }, [isEditMode, reviewId])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // Handle destination selection
  const handleDestinationChange = (value: string) => {
    setFormData({ ...formData, placeId: value })

    // Clear error for this field if it exists
    if (errors.placeId) {
      setErrors({ ...errors, placeId: "" })
    }
  }

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating })

    // Clear error for this field if it exists
    if (errors.rating) {
      setErrors({ ...errors, rating: "" })
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)

      // Limit to 5 images total
      if (formData.images.length + newImages.length > 5) {
        alert("최대 5개의 이미지만 업로드할 수 있습니다.")
        return
      }

      // Create preview URLs
      const newPreviews = newImages.map((file) => URL.createObjectURL(file))

      setFormData({ ...formData, images: [...formData.images, ...newImages] })
      setPreviewImages([...previewImages, ...newPreviews])
    }
  }

  // Remove image
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images]
    const updatedPreviews = [...previewImages]

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index])

    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setFormData({ ...formData, images: updatedImages })
    setPreviewImages(updatedPreviews)
  }

  // Validate form
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.")
      router.push("/member/login")
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would submit to your API
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // const formDataToSend = new FormData();
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('content', formData.content);
      // formDataToSend.append('rating', formData.rating.toString());
      // formDataToSend.append('placeId', formData.placeId);
      // formData.images.forEach(image => {
      //   formDataToSend.append('images', image);
      // });

      // const url = isEditMode
      //   ? `${apiUrl}/review/${reviewId}`
      //   : `${apiUrl}/review`;

      // const method = isEditMode ? 'PUT' : 'POST';

      // await fetch(url, {
      //   method,
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: formDataToSend
      // });

      // Mock successful submission
      setTimeout(() => {
        alert(isEditMode ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.")
        router.push("/community")
      }, 1000)
    } catch (err) {
      console.error("Error submitting review:", err)
      setFormError("리뷰 제출 중 오류가 발생했습니다.")
      setIsSubmitting(false)
    }
  }

  // Clean up preview URLs when component unmounts
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
          {/* Title */}
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

          {/* Destination */}
          <div className="mb-6">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              여행지 <span className="text-red-500">*</span>
            </label>
            <Select value={formData.placeId} onValueChange={handleDestinationChange}>
              <SelectTrigger className={errors.placeId ? "border-red-500" : ""}>
                <SelectValue placeholder="여행지를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id.toString()}>
                    {destination.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.placeId && <p className="mt-1 text-sm text-red-500">{errors.placeId}</p>}
          </div>

          {/* Rating */}
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

          {/* Content */}
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

          {/* Image Upload */}
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

            {/* Image Previews */}
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

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/community")}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || !isLoggedIn}>
              {isSubmitting ? "제출 중..." : isEditMode ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

