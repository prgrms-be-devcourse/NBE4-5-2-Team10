import { Suspense } from "react"
import ReviewDetail from "../review-detail"
import type { Metadata } from "next"

interface ReviewDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ReviewDetailPageProps): Promise<Metadata> {
  // 실제 구현에서는 서버 컴포넌트에서 리뷰 정보를 가져와 동적으로 메타데이터 생성
  return {
    title: `TripFriend - 여행 리뷰`,
    description: "여행자들의 생생한 리뷰와 경험을 공유하는 공간입니다.",
  }
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-10">리뷰를 불러오는 중...</div>}>
          <ReviewDetail id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}