package com.tripfriend.domain.review.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.review.dto.ReviewRequestDto;
import com.tripfriend.domain.review.dto.ReviewResponseDto;
import com.tripfriend.domain.review.entity.Review;
import com.tripfriend.domain.review.entity.ReviewViewCount;
import com.tripfriend.domain.review.repository.CommentRepository;
import com.tripfriend.domain.review.repository.ReviewRepository;
import com.tripfriend.domain.review.repository.ReviewViewCountRepository;
import com.tripfriend.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final ReviewViewCountRepository viewCountRepository;

    // 리뷰 생성
    @Transactional
    public ReviewResponseDto createReview(ReviewRequestDto requestDto, Member member) {
        // 유효성 검증 추가
        if (requestDto.getPlaceId() == null) {
            throw new ServiceException("400-1", "여행지 정보는 필수입니다.");
        }

        if (requestDto.getRating() < 1 || requestDto.getRating() > 5) {
            throw new ServiceException("400-2", "평점은 1점에서 5점 사이여야 합니다.");
        }
        Review review = new Review(
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getRating(),
                member,
                requestDto.getPlaceId()
        );

        // 리뷰 저장
        Review savedReview = reviewRepository.save(review);

        // 조회수 엔티티 초기화
        ReviewViewCount viewCount = new ReviewViewCount(savedReview);
        viewCountRepository.save(viewCount);

        return new ReviewResponseDto(savedReview, member.getNickname(), 0);
    }

    // 리뷰 상세 조회
    @Transactional
    public ReviewResponseDto getReview(Long reviewId, boolean incrementView) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 리뷰입니다."));

        // 조회수 처리
        ReviewViewCount viewCount = viewCountRepository.findById(reviewId)
                .orElseGet(() -> {
                    ReviewViewCount newViewCount = new ReviewViewCount(review);
                    return viewCountRepository.save(newViewCount);
                });

        // 새로운 조회일 경우에만 조회수 증가
        if (incrementView) {
            viewCount.increment();
            viewCountRepository.save(viewCount);
        }

        // 댓글 수 조회
        int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(reviewId).size();

        // 응답 DTO 생성
        ReviewResponseDto responseDto = new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);
        responseDto.setViewCount(viewCount.getCount());

        return responseDto;
    }
    // 원본 메서드를 오버로딩하여 하위 호환성 유지
    @Transactional
    public ReviewResponseDto getReview(Long reviewId) {
        return getReview(reviewId, true); // 기본적으로 조회수 증가
    }

    // 특정 장소의 리뷰 목록 조회
    public List<ReviewResponseDto> getReviewsByPlace(Long placeId) {
        if (placeId == null) {
            throw new ServiceException("400-3", "여행지 ID는 필수입니다.");
        }

        List<Review> reviews = reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);

        return reviews.stream()
                .map(review -> {
                    int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();
                    ReviewResponseDto dto = new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);

                    // 조회수 설정
                    viewCountRepository.findById(review.getReviewId())
                            .ifPresent(viewCount -> dto.setViewCount(viewCount.getCount()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 리뷰 수정
    @Transactional
    public ReviewResponseDto updateReview(Long reviewId, ReviewRequestDto requestDto, Member member) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 리뷰입니다."));

        // 작성자 본인인지 확인
        if (!review.getMember().getId().equals(member.getId())) {
            throw new ServiceException("403-1", "리뷰 작성자만 수정할 수 있습니다.");
        }

        // 평점 유효성 검증
        if (requestDto.getRating() < 1 || requestDto.getRating() > 5) {
            throw new ServiceException("400-2", "평점은 1점에서 5점 사이여야 합니다.");
        }

        // 리뷰 내용 업데이트
        review.update(requestDto.getTitle(), requestDto.getContent(), requestDto.getRating());

        // 댓글 수 조회
        int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(reviewId).size();

        // 응답 DTO 생성
        ReviewResponseDto responseDto = new ReviewResponseDto(review, member.getNickname(), commentCount);

        // 조회수 설정
        viewCountRepository.findById(reviewId)
                .ifPresent(viewCount -> responseDto.setViewCount(viewCount.getCount()));

        return responseDto;
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId, Member member) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 리뷰입니다."));

        // 작성자 본인인지 확인
        if (!review.getMember().getId().equals(member.getId())) {
            throw new ServiceException("403-1", "리뷰 작성자만 삭제할 수 있습니다.");
        }

        // 조회수 데이터 먼저 삭제
        viewCountRepository.deleteById(reviewId);

        // 리뷰 삭제
        reviewRepository.delete(review);
    }

    // 인기 게시물 조회
    public List<ReviewResponseDto> getPopularReviews(int limit) {
        // 모든 리뷰 조회
        List<Review> allReviews = reviewRepository.findAll();

        // 리뷰와 가중치 점수를 계산하여 정렬
        List<ReviewWithScore> reviewsWithScores = allReviews.stream()
                .map(review -> {
                    // 조회수 가져오기
                    int viewCount = viewCountRepository.findById(review.getReviewId())
                            .map(ReviewViewCount::getCount)
                            .orElse(0);

                    // 댓글 수 조회
                    int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();

                    // 가중치 점수 계산: 조회수(0.5) + 평점(2.0) + 댓글 수(1.5)
                    double score = (viewCount * 0.5) + (review.getRating() * 2.0) + (commentCount * 1.5);

                    return new ReviewWithScore(review, score, commentCount, viewCount);
                })
                .sorted((r1, r2) -> Double.compare(r2.score, r1.score)) // 점수 내림차순 정렬
                .limit(limit)
                .collect(Collectors.toList());

        // DTO로 변환
        return reviewsWithScores.stream()
                .map(reviewWithScore -> {
                    ReviewResponseDto dto = new ReviewResponseDto(
                            reviewWithScore.review,
                            reviewWithScore.review.getMember().getNickname(),
                            reviewWithScore.commentCount
                    );
                    dto.setViewCount(reviewWithScore.viewCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 리뷰 목록 조회 (정렬 및 검색 기능)
    public List<ReviewResponseDto> getReviews(String sort, String keyword, Long placeId, Long memberId) {
        List<Review> reviews = new ArrayList<>();

        // 유효한 정렬 옵션 목록
        List<String> validSortOptions = Arrays.asList(
                "newest", "oldest", "highest_rating", "lowest_rating", "comments", "most_viewed"
        );

        // 유효하지 않은 정렬 옵션 처리
        if (!validSortOptions.contains(sort)) {
            throw new ServiceException("400-4", "유효하지 않은 정렬 옵션입니다.");
        }

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
                case "most_viewed":
                    // 조회수 기준 정렬은 별도 처리 필요
                    return getMostViewedReviews();
                case "newest":
                default:
                    reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
                    break;
            }
        }

        // 각 리뷰의 댓글 수와 조회수를 조회하여 DTO 생성
        List<ReviewResponseDto> reviewDtos = new ArrayList<>();
        for (Review review : reviews) {
            int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();
            ReviewResponseDto dto = new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);

            // 조회수 설정
            viewCountRepository.findById(review.getReviewId())
                    .ifPresent(viewCount -> dto.setViewCount(viewCount.getCount()));

            reviewDtos.add(dto);
        }

        return reviewDtos;
    }

    // 조회수 기준으로 정렬된 리뷰 목록 반환
    private List<ReviewResponseDto> getMostViewedReviews() {
        List<ReviewViewCount> sortedViewCounts = viewCountRepository.findAll()
                .stream()
                .sorted((vc1, vc2) -> Integer.compare(vc2.getCount(), vc1.getCount()))
                .collect(Collectors.toList());

        List<ReviewResponseDto> result = new ArrayList<>();

        for (ReviewViewCount viewCount : sortedViewCounts) {
            Review review = viewCount.getReview();
            int commentCount = commentRepository.findByReviewReviewIdOrderByCreatedAtAsc(review.getReviewId()).size();

            ReviewResponseDto dto = new ReviewResponseDto(review, review.getMember().getNickname(), commentCount);
            dto.setViewCount(viewCount.getCount());

            result.add(dto);
        }

        return result;
    }

    // 댓글 수 기준 정렬 결과 처리
    private List<ReviewResponseDto> processCommentSortedResults(List<Object[]> commentCountResult) {
        List<ReviewResponseDto> reviewDtos = new ArrayList<>();

        for (Object[] result : commentCountResult) {
            Review review = (Review) result[0];
            Long commentCount = (Long) result[1];

            ReviewResponseDto dto = new ReviewResponseDto(
                    review,
                    review.getMember().getNickname(),
                    commentCount.intValue()
            );

            // 조회수 설정
            viewCountRepository.findById(review.getReviewId())
                    .ifPresent(viewCount -> dto.setViewCount(viewCount.getCount()));

            reviewDtos.add(dto);
        }

        return reviewDtos;
    }

    // 인기 게시물 정렬을 위한 내부 클래스
    private static class ReviewWithScore {
        private final Review review;
        private final double score;
        private final int commentCount;
        private final int viewCount;

        public ReviewWithScore(Review review, double score, int commentCount, int viewCount) {
            this.review = review;
            this.score = score;
            this.commentCount = commentCount;
            this.viewCount = viewCount;
        }
    }
}