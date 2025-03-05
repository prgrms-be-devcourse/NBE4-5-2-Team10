package com.tripfriend.domain.review.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.review.dto.ReviewRequestDto;
import com.tripfriend.domain.review.dto.ReviewResponseDto;
import com.tripfriend.domain.review.entity.Review;
import com.tripfriend.domain.review.repository.CommentRepository;
import com.tripfriend.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    // 리뷰 생성
    @Transactional
    public ReviewResponseDto createReview(ReviewRequestDto requestDto, Member member) {

        Review review = new Review(
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getRating(),
                member,
                requestDto.getPlaceId()
        );

        // 리뷰 저장
        Review savedReview = reviewRepository.save(review);

        return new ReviewResponseDto(savedReview, member.getNickname(), 0);
    }

    // 리뷰 상세 조회
    public ReviewResponseDto getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        // 댓글 수 조회
        int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(reviewId).size();

        return new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);
    }

    // 특정 장소의 리뷰 목록 조회
    public List<ReviewResponseDto> getReviewsByPlace(Long placeId) {
        List<Review> reviews = reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);

        return reviews.stream()
                .map(review -> {
                    int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();
                    return new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);
                })
                .collect(Collectors.toList());
    }

    // 리뷰 수정
    @Transactional
    public ReviewResponseDto updateReview(Long reviewId, ReviewRequestDto requestDto, Member member) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        // 작성자 본인인지 확인
        if (!review.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("리뷰 작성자만 수정할 수 있습니다.");
        }

        // 리뷰 내용 업데이트
        review.update(requestDto.getTitle(), requestDto.getContent(), requestDto.getRating());

        // 댓글 수 조회
        int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(reviewId).size();

        return new ReviewResponseDto(review, member.getNickname(), commentCount);
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId, Member member) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        // 작성자 본인인지 확인
        if (!review.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("리뷰 작성자만 삭제할 수 있습니다.");
        }

        // 리뷰 삭제
        reviewRepository.delete(review);
    }
}