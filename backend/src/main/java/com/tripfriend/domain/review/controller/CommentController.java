package com.tripfriend.domain.review.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.review.dto.CommentRequestDto;
import com.tripfriend.domain.review.dto.CommentResponseDto;
import com.tripfriend.domain.review.service.CommentService;
import com.tripfriend.global.dto.RsData;
import com.tripfriend.global.exception.ServiceException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final MemberRepository memberRepository;

    // 임시 회원 조회 - 실제 인증 시스템으로 대체 예정
    private Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ServiceException("404-2", "회원을 찾을 수 없습니다."));
    }

    // 댓글 생성
    @PostMapping
    public RsData<CommentResponseDto> createComment(
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestParam(name = "memberId",defaultValue = "1") Long memberId) {
        // 임시 인증 로직
        Member member = getMemberById(memberId);
        CommentResponseDto responseDto = commentService.createComment(requestDto, member);
        return new RsData<>("201-1", "댓글이 성공적으로 등록되었습니다.", responseDto);
    }

    // 댓글 상세 조회
    @GetMapping("/{commentId}")
    public RsData<CommentResponseDto> getComment(@PathVariable("commentId") Long commentId) {
        CommentResponseDto responseDto = commentService.getComment(commentId);
        return new RsData<>("200-1", "댓글 조회에 성공했습니다.", responseDto);
    }

    // 특정 리뷰의 댓글 목록 조회
    @GetMapping("/review/{reviewId}")
    public RsData<List<CommentResponseDto>> getCommentsByReview(@PathVariable("reviewId") Long reviewId) {
        List<CommentResponseDto> responseDtoList = commentService.getCommentsByReview(reviewId);
        return new RsData<>("200-2", "리뷰의 댓글 목록을 성공적으로 조회했습니다.", responseDtoList);
    }

    // 특정 회원의 댓글 목록 조회
    @GetMapping("/member/{memberId}")
    public RsData<List<CommentResponseDto>> getCommentsByMember(@PathVariable("memberId") Long memberId) {
        List<CommentResponseDto> responseDtoList = commentService.getCommentsByMember(memberId);
        return new RsData<>("200-3", "회원의 댓글 목록을 성공적으로 조회했습니다.", responseDtoList);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public RsData<CommentResponseDto> updateComment(
            @PathVariable("commentId") Long commentId,
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestParam(name = "memberId",defaultValue = "1") Long memberId) {

        // 임시 인증 로직
        Member member = getMemberById(memberId);
        CommentResponseDto responseDto = commentService.updateComment(commentId, requestDto, member);
        return new RsData<>("200-4", "댓글이 성공적으로 수정되었습니다.", responseDto);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public RsData<Void> deleteComment(
            @PathVariable("commentId") Long commentId,
            @RequestParam(name = "memberId", defaultValue = "1") Long memberId) {

        // 임시 인증 로직
        Member member = getMemberById(memberId);
        commentService.deleteComment(commentId, member);
        return new RsData<>("200-5", "댓글이 성공적으로 삭제되었습니다.");
    }
}