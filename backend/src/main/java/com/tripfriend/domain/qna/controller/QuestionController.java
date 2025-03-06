package com.tripfriend.domain.qna.controller;

import com.tripfriend.domain.qna.dto.QuestionDto;
import com.tripfriend.domain.qna.entity.Question;
import com.tripfriend.domain.qna.repository.QuestionRepository;
import com.tripfriend.domain.qna.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qna/question")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    //질문 생성
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionDto requestDto) {

        Question question = questionService.createQuestion(
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getMemberId()
        );
        return ResponseEntity.ok(question);
    }

    //전체 질문 조회
    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDto> responseDtos = questions.stream()
                .map(QuestionDto::new)
                .toList();
        return ResponseEntity.ok(responseDtos);
    }


    // 질문 검색
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    //질문 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionById(@PathVariable Long id) {
        questionService.deleteQuestionById(id);
        return ResponseEntity.noContent().build();
    }

}
