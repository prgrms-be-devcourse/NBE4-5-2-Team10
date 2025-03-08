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

import java.util.ArrayList;
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

    // 리뷰 목록 조회 (정렬 및 검색 기능)
    public List<ReviewResponseDto> getReviews(String sort, String keyword, Long placeId, Long memberId) {
        List<Review> reviews = new ArrayList<>();
        List<ReviewResponseDto> reviewDtos = new ArrayList<>();

        // 특정 회원의 리뷰만 조회
        if (memberId != null) {
            reviews = reviewRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
        }
        // 특정 여행지의 리뷰만 조회
        else if (placeId != null) {
            if ("highest_rating".equals(sort)) {
                reviews = reviewRepository.findByPlaceIdOrderByRatingDesc(placeId);
            } else if ("lowest_rating".equals(sort)) {
                reviews = reviewRepository.findByPlaceIdOrderByRatingAsc(placeId);
            } else {
                reviews = reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);
            }
        }
        // 제목 검색
        else if (keyword != null && !keyword.trim().isEmpty()) {
            reviews = reviewRepository.findByTitleContainingOrderByCreatedAtDesc(keyword);
        }
        // 전체 리뷰 조회 (정렬 옵션 적용)
        else {
            switch (sort) {
                case "comments":
                    List<Object[]> commentCountResult = reviewRepository.findAllOrderByCommentCountDesc();
                    return processCommentSortedResults(commentCountResult);
                case "oldest":
                    reviews = reviewRepository.findAllByOrderByCreatedAtAsc();
                    break;
                case "highest_rating":
                    reviews = reviewRepository.findAllByOrderByRatingDesc();
                    break;
                case "lowest_rating":
                    reviews = reviewRepository.findAllByOrderByRatingAsc();
                    break;
                case "newest":
                default:
                    reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
                    break;
            }
        }

        // 각 리뷰의 댓글 수를 조회하여 DTO 생성
        for (Review review : reviews) {
            int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();
            reviewDtos.add(new ReviewResponseDto(review, review.getMember().getNickname(), commentCount));
        }

        return reviewDtos;
    }

    // 댓글 수 기준 정렬 결과 처리
    private List<ReviewResponseDto> processCommentSortedResults(List<Object[]> commentCountResult) {
        List<ReviewResponseDto> reviewDtos = new ArrayList<>();

        for (Object[] result : commentCountResult) {
            Review review = (Review) result[0];
            Long commentCount = (Long) result[1];

            reviewDtos.add(new ReviewResponseDto(
                    review,
                    review.getMember().getNickname(),
                    commentCount.intValue()
            ));
        }

        return reviewDtos;
    }
}
