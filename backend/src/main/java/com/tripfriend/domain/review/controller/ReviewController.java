package com.tripfriend.domain.review.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.review.dto.ReviewRequestDto;
import com.tripfriend.domain.review.dto.ReviewResponseDto;
import com.tripfriend.domain.review.service.ReviewService;
import com.tripfriend.global.dto.RsData;
import com.tripfriend.global.exception.ServiceException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final MemberRepository memberRepository;

    // 임시 회원 조회 - 실제 인증 시스템으로 대체 예정
    private Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ServiceException("404-2", "회원을 찾을 수 없습니다."));
    }

    // 리뷰 생성
    @PostMapping
    public RsData<ReviewResponseDto> createReview(
            @Valid @RequestBody ReviewRequestDto requestDto,
            @RequestParam(defaultValue = "1") Long memberId) {

        // 임시 인증 로직 - 토큰/Redis 인증으로 교체 예정
        Member member = getMemberById(memberId);
        ReviewResponseDto responseDto = reviewService.createReview(requestDto, member);
        return new RsData<>("201-1", "리뷰가 성공적으로 등록되었습니다.", responseDto);
    }

    // 리뷰 상세 조회
    @GetMapping("/{reviewId}")
    public RsData<ReviewResponseDto> getReview(@PathVariable Long reviewId) {
        ReviewResponseDto responseDto = reviewService.getReview(reviewId);
        return new RsData<>("200-1", "리뷰 조회에 성공했습니다.", responseDto);
    }

    // 특정 장소의 리뷰 목록 조회
    @GetMapping("/place/{placeId}")
    public RsData<List<ReviewResponseDto>> getReviewsByPlace(@PathVariable Long placeId) {
        List<ReviewResponseDto> responseDtoList = reviewService.getReviewsByPlace(placeId);
        return new RsData<>("200-2", "장소의 리뷰 목록을 성공적으로 조회했습니다.", responseDtoList);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public RsData<ReviewResponseDto> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequestDto requestDto,
            @RequestParam(defaultValue = "1") Long memberId){
        // 임시 인증 로직
        Member member = getMemberById(memberId);
        ReviewResponseDto responseDto = reviewService.updateReview(reviewId, requestDto, member);
        return new RsData<>("200-3", "리뷰가 성공적으로 수정되었습니다.", responseDto);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public RsData<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam(defaultValue = "1") Long memberId) {
        // 임시 인증 로직
        Member member = getMemberById(memberId);
        reviewService.deleteReview(reviewId, member);
        return new RsData<>("200-4", "리뷰가 성공적으로 삭제되었습니다.");
    }

    // 리뷰 목록 조회 (정렬 및 검색)
    @GetMapping
    public RsData<List<ReviewResponseDto>> getReviews(
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long placeId,
            @RequestParam(required = false) Long memberId) {

        List<ReviewResponseDto> reviews = reviewService.getReviews(sort, keyword, placeId, memberId);
        return new RsData<>("200-5", "리뷰 목록을 성공적으로 조회했습니다.", reviews);
    }

}