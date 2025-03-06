package com.tripfriend.domain.qna.dto;

import com.tripfriend.domain.qna.entity.Question;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class QuestionDto {
    private String title;
    private String content;
    private Long memberId;

    private String createdAt;
    private String updatedAt;
    private String memberUsername;

    public QuestionDto(Question question) {
        this.memberId = question.getId();
        this.title = question.getTitle();
        this.content = question.getContent();
        this.createdAt = question.getCreatedAt().toString();
        this.updatedAt = question.getUpdatedAt().toString();
        this.memberUsername = question.getMember().getUsername();
    }
}
