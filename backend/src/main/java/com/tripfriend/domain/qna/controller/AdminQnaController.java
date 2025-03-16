package com.tripfriend.domain.qna.controller;

import com.tripfriend.domain.qna.dto.QuestionDto;
import com.tripfriend.domain.qna.dto.QuestionWithAnswersDto;
import com.tripfriend.domain.qna.service.AnswerService;
import com.tripfriend.domain.qna.service.QuestionService;
import com.tripfriend.global.annotation.CheckPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/qna")
public class AdminQnaController {

    private final QuestionService questionService;
    private final AnswerService answerService;

    // 관리자용 QnA 목록 조회
    @CheckPermission("ADMIN")
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDto>> getAllQuestionsForAdmin() {
        List<QuestionDto> questions = questionService.getAllQuestionsForAdmin();
        return ResponseEntity.ok(questions);
    }

    // 관리자용 QnA 삭제
    @CheckPermission("ADMIN")
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable("id") Long id) {
        questionService.deleteQuestionByAdmin(id);
        return ResponseEntity.noContent().build();
    }
    // 관리자용 답변 삭제
    @CheckPermission("ADMIN")
    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswerByAdmin(@PathVariable("id") Long id) {
        answerService.deleteAnswerByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @CheckPermission("ADMIN")
    @GetMapping("/questions/{id}")
    public ResponseEntity<QuestionWithAnswersDto> getQuestionWithAnswers(@PathVariable("id") Long id) {
        QuestionWithAnswersDto dto = questionService.getQuestionWithAnswers(id);
        return ResponseEntity.ok(dto);
    }



}
