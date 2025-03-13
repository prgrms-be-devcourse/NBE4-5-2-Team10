package com.tripfriend.domain.qna.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.qna.dto.QuestionDto;
import com.tripfriend.domain.qna.entity.Question;
import com.tripfriend.domain.qna.repository.QuestionRepository;
import com.tripfriend.domain.qna.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qna")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    private final AuthService authService;


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
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable("id") Long id) {
        Question question = questionService.getQuestionById(id);
        return ResponseEntity.ok(new QuestionDto(question));
    }

    //질문 삭제
    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable("questionId") Long questionId,
            @RequestHeader("Authorization") String token
    ) {
        Member member = authService.getLoggedInMember(token);
        questionService.deleteQuestionById(questionId, member);
        return ResponseEntity.noContent().build();
    }

    //질문생성
    @PostMapping("/question")
    public ResponseEntity<Void> createQuestion(
            @RequestBody QuestionDto requestDto,
            @RequestHeader("Authorization") String token
    ) {
        Member member = authService.getLoggedInMember(token);
        questionService.createQuestion(requestDto.getTitle(), requestDto.getContent(), member);
        return ResponseEntity.ok().build();
    }


}
