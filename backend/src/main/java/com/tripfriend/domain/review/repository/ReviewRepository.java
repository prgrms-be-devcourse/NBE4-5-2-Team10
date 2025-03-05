package com.tripfriend.domain.review.repository;

import com.tripfriend.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 특정 장소의 리뷰 목록 최신순으로 조회
    List<Review> findByPlaceIdOrderByCreatedAtDesc(Long placeId);

    // 특정 회원이 작성한 리뷰 목록 조회
    List<Review> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    // 평점이 높은 리뷰 상위 n개 조회
    List<Review> findTop10ByOrderByRatingDesc();
}