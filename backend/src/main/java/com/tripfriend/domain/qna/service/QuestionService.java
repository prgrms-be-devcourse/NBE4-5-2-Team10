package com.tripfriend.domain.qna.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.qna.entity.Question;
import com.tripfriend.domain.qna.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;

    //질문 생성
    public Question createQuestion(String title, String content, Member member) {
        Question question = Question.builder()
                .title(title)
                .content(content)
                .member(member)
                .build();
        return questionRepository.save(question);
    }

    //전체 질문 조회
    public List<Question> getAllQuestions() {
        return questionRepository.findAllWithMember();
    }

    //특정 질문 조회
    public Question getQuestionById(Long id) {
        return questionRepository.findByIdWithMember(id)
                .orElseThrow(() -> new RuntimeException("해당 질문을 찾을 수 없습니다."));
    }

    //질문 삭제
    public void deleteQuestionById(Long id, Member member) {
        Question question = getQuestionById(id);

        // 작성자인지 확인
        if (!question.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("작성자만 질문을 삭제할 수 있습니다.");
        }

        questionRepository.delete(question);
    }

    }
