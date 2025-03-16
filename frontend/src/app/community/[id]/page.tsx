<<<<<<< HEAD
import { Suspense } from "react";
import ReviewDetail from "../review-detail";
import type { Metadata } from "next";
=======
import { Suspense } from "react"
import type { Metadata } from "next"
import ReviewDetail from "../review-detail"
>>>>>>> a8846871a08c2387a23148e5156e5106d022c827

interface ReviewDetailPageProps {
  params: {
    id: string;
  };
}

<<<<<<< HEAD
export async function generateMetadata({
  params,
}: ReviewDetailPageProps): Promise<Metadata> {
  // 실제 구현에서는 서버 컴포넌트에서 리뷰 정보를 가져와 동적으로 메타데이터 생성
  return {
    title: `TripFriend - 여행 리뷰`,
    description: "여행자들의 생생한 리뷰와 경험을 공유하는 공간입니다.",
  };
=======
export const metadata: Metadata = {
  title: "TripFriend - 여행 리뷰",
  description: "여행자들의 생생한 리뷰와 경험을 공유하는 공간입니다.",
>>>>>>> a8846871a08c2387a23148e5156e5106d022c827
}

// 서버 컴포넌트를 async로 선언
export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  // 동적 라우트 파라미터에 접근하기 전에 async/await 패턴을 사용
  const id = params.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <Suspense
          fallback={
            <div className="text-center py-10">리뷰를 불러오는 중...</div>
          }
        >
          <ReviewDetail id={params.id} />
=======
        <Suspense fallback={<div className="text-center py-10">리뷰를 불러오는 중...</div>}>
          <ReviewDetail id={id} />
>>>>>>> a8846871a08c2387a23148e5156e5106d022c827
        </Suspense>
      </div>
    </div>
  );
}
