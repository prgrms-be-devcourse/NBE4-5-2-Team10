package com.tripfriend.domain.review.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.review.dto.CommentRequestDto;
import com.tripfriend.domain.review.dto.CommentResponseDto;
import com.tripfriend.domain.review.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final MemberRepository memberRepository; // 이 부분 추가

    // 메서드 수정
    private Member getCurrentMember() {
        // 데이터베이스에서 실제 존재하는 회원 조회
        return memberRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다. 데이터베이스에 회원 데이터가 존재하는지 확인하세요."));
    }

    // 댓글 생성
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(@Valid @RequestBody CommentRequestDto requestDto) {
        Member member = getCurrentMember();
        CommentResponseDto responseDto = commentService.createComment(requestDto, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 댓글 상세 조회
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> getComment(@PathVariable Long commentId) {
        CommentResponseDto responseDto = commentService.getComment(commentId);
        return ResponseEntity.ok(responseDto);
    }

    // 특정 리뷰의 댓글 목록 조회
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByReview(@PathVariable Long reviewId) {
        List<CommentResponseDto> responseDtoList = commentService.getCommentsByReview(reviewId);
        return ResponseEntity.ok(responseDtoList);
    }

    // 특정 회원의 댓글 목록 조회
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByMember(@PathVariable Long memberId) {
        List<CommentResponseDto> responseDtoList = commentService.getCommentsByMember(memberId);
        return ResponseEntity.ok(responseDtoList);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequestDto requestDto) {
        Member member = getCurrentMember();
        CommentResponseDto responseDto = commentService.updateComment(commentId, requestDto, member);
        return ResponseEntity.ok(responseDto);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        Member member = getCurrentMember();
        commentService.deleteComment(commentId, member);
        return ResponseEntity.noContent().build();
    }
}