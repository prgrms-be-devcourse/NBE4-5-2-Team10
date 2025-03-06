package com.tripfriend.domain.qna.controller;

import com.tripfriend.domain.qna.entity.Answer;
import com.tripfriend.domain.qna.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qna/answer")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;

    //답변 생성
    public ResponseEntity<Void> createAnswer(
            @RequestParam Long questionId,
            @RequestParam Long memberId,
            @RequestParam String content) {
        answerService.createAnswer(questionId, memberId, content);
        return ResponseEntity.ok().build();

    }
    //답변 삭제
    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long answerId) {
        answerService.deleteAnswer(answerId);
        return ResponseEntity.noContent().build();
    }
}
