package com.tripfriend.domain.review.dto;

import com.tripfriend.domain.review.entity.Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private Long reviewId;
    private Long memberId;
    private String memberName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponseDto(Comment comment, String memberName) {
        this.commentId = comment.getCommentId();
        this.content = comment.getContent();
        this.reviewId = comment.getReview().getReviewId();
        this.memberId = comment.getMember().getId();
        this.memberName = memberName;
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
}