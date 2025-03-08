package com.tripfriend.domain.review.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.review.dto.ReviewRequestDto;
import com.tripfriend.domain.review.dto.ReviewResponseDto;
import com.tripfriend.domain.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final MemberRepository memberRepository;

    // 임시로 현재 로그인한 사용자를 가져오는 메서드
    private Member getCurrentMember() {
        // 데이터베이스에서 실제 존재하는 회원 조회
        return memberRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다. 데이터베이스에 회원 데이터가 존재하는지 확인하세요."));
    }

    // 리뷰 생성
    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@Valid @RequestBody ReviewRequestDto requestDto) {
        Member member = getCurrentMember();
        ReviewResponseDto responseDto = reviewService.createReview(requestDto, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 리뷰 상세 조회
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDto> getReview(@PathVariable Long reviewId) {
        ReviewResponseDto responseDto = reviewService.getReview(reviewId);
        return ResponseEntity.ok(responseDto);
    }

    // 특정 장소의 리뷰 목록 조회
    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByPlace(@PathVariable Long placeId) {
        List<ReviewResponseDto> responseDtoList = reviewService.getReviewsByPlace(placeId);
        return ResponseEntity.ok(responseDtoList);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDto> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequestDto requestDto) {
        Member member = getCurrentMember();
        ReviewResponseDto responseDto = reviewService.updateReview(reviewId, requestDto, member);
        return ResponseEntity.ok(responseDto);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Member member = getCurrentMember();
        reviewService.deleteReview(reviewId, member);
        return ResponseEntity.noContent().build();
    }

    // 리뷰 목록 조회 (정렬 및 검색)
    @GetMapping
    public ResponseEntity<List<ReviewResponseDto>> getReviews(
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long placeId,
            @RequestParam(required = false) Long memberId) {

        List<ReviewResponseDto> reviews = reviewService.getReviews(sort, keyword, placeId, memberId);
        return ResponseEntity.ok(reviews);
    }

}